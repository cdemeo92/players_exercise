import { Inject, Injectable } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { Filter } from '../application/domain/filter.value-object';
import { Pagination } from '../application/domain/pagination.value-object';
import { Player, UPDATE_STATUS } from '../application/domain/player.entity';
import {
  GetPlayersResult,
  PlayerRepositoryPort,
  PurPlayersResult,
} from '../application/ports/player-repository.port';

@Injectable()
export class PlayerRepositoryAdapter implements PlayerRepositoryPort {
  private readonly playerCollection: Collection<Player>;

  public constructor(
    @Inject('MONGO_CLIENT') private readonly dbClient: MongoClient,
    @Inject('DB_NAME') private readonly dbName: string,
    @Inject('COLLECTION_NAME') private readonly collectionName: string,
  ) {
    this.playerCollection = dbClient
      .db(dbName)
      .collection<Player>(collectionName);
  }

  public async getPlayers(
    filter?: Filter,
    pagination?: Pagination,
  ): Promise<GetPlayersResult> {
    const page = pagination?.getPage() ?? 1;
    const pageSize = pagination?.getPageSize(10) ?? 10;

    const playersDocument = await this.playerCollection
      .aggregate<{
        metadata: Array<{ totalCount: number }>;
        players: Array<Record<string, unknown>>;
      }>([
        { $match: this.filterToMatch(filter) },
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            players: [
              { $skip: (page - 1) * pageSize || 0 },
              ...(isFinite(pageSize) ? [{ $limit: pageSize }] : []),
            ],
          },
        },
      ])
      .toArray();

    return {
      page: page,
      pageSize: pageSize,
      totalCount: playersDocument?.[0]?.metadata?.[0]?.totalCount ?? 0,
      players: playersDocument?.[0]?.players.map((p) => new Player(p)) ?? [],
    };
  }

  public async putPlayers(
    players: Array<Player>,
    overwrite?: boolean,
  ): Promise<PurPlayersResult> {
    const result = await this.playerCollection.bulkWrite(
      players.map((player) => ({
        updateOne: {
          filter: {
            id: player.id,
            ...(!overwrite && {
              updateStatus: { $ne: UPDATE_STATUS.TO_UPDATE },
            }),
          },
          update: { $set: player.toObject() },
          upsert: true,
        },
      })),
    );

    return {
      insertedPlayers: result.upsertedCount,
      modifiedPlayers: result.modifiedCount,
    };
  }

  private filterToMatch(filter?: Filter): Record<string, unknown> {
    return {
      updateStatus: filter?.updateStatus ?? UPDATE_STATUS.UPDATED,
      ...(filter?.position !== undefined && { position: filter.position }),
      ...(filter?.birthYearRange !== undefined &&
        (filter?.birthYearRange?.start != undefined ||
          filter?.birthYearRange?.end != undefined) && {
          dateOfBirth: {
            ...(filter?.birthYearRange?.start != undefined && {
              $gte: `${filter.birthYearRange.start}-01-01`,
            }),
            ...(filter?.birthYearRange?.end != undefined && {
              $lte: `${filter.birthYearRange.end}-12-31`,
            }),
          },
        }),
      ...(filter?.isActive !== undefined && { isActive: filter.isActive }),
      ...(filter?.clubId !== undefined && { clubId: filter.clubId }),
    };
  }
}
