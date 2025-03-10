import { Injectable } from '@nestjs/common';
import { PlayerRepositoryPort } from 'src/application/ports/player-repository.port';
import { Filter, Pagination } from 'src/domain/filter.value-object';
import { Player } from 'src/domain/player.entity';

@Injectable()
export class PlayerRepositoryAdapter implements PlayerRepositoryPort {
  getPlayers(filter?: Filter, pagination?: Pagination): Array<Player> {
    throw new Error('Method not implemented.');
  }
}
