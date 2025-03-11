import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { PlayerRepositoryPort } from '../application/ports/player-repository.port';
import { Filter, Pagination } from '../domain/filter.value-object';
import { Player } from '../domain/player.entity';

@Injectable()
export class PlayerRepositoryAdapter implements PlayerRepositoryPort {
  private readonly collection: Collection<Player>;

  public constructor(@Inject('MONGO_CLIENT') private readonly dbClient: Db) {
    this.collection = dbClient.collection<Player>('players');
  }

  public async getPlayers(
    filter?: Filter,
    pagination?: Pagination,
  ): Promise<Array<Player>> {
    return this.collection.find().toArray();
  }
}
