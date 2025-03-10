import { Filter, Pagination } from 'src/domain/filter.value-object';
import { Player } from 'src/domain/player.entity';

export interface PlayerRepositoryPort {
  getPlayers(filter?: Filter, pagination?: Pagination): Array<Player>;
}
