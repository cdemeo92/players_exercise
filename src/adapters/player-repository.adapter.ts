import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { PlayerRepositoryPort } from '../application/ports/player-repository.port';
import { Filter } from '../domain/filter.value-object';
import { Pagination } from '../domain/pagination.value-object';
import { Player } from '../domain/player.entity';

@Injectable()
export class PlayerRepositoryAdapter implements PlayerRepositoryPort {
  private readonly playerCollection: Collection<Player>;

  public constructor(@Inject('MONGO_CLIENT') private readonly dbClient: Db) {
    this.playerCollection = dbClient.collection<Player>('players');
  }

  public async getPlayers(
    filter?: Filter,
    pagination?: Pagination,
  ): Promise<Array<Player>> {
    const page = pagination?.getPage() ?? 1;
    const pageSize = pagination?.getPageSize(10) ?? 10;

    const playersDocument = await this.playerCollection
      .aggregate([
        { $match: filter?.getFilterObject() ?? {} },
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            players: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          },
        },
      ])
      .toArray();

    return playersDocument?.[0]?.players ?? [];
  }
}
