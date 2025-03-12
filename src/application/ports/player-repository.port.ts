import { Filter } from '../../domain/filter.value-object';
import { Pagination } from '../../domain/pagination.value-object';
import { Player } from '../../domain/player.entity';

export interface PlayerRepositoryPort {
  getPlayers(filter?: Filter, pagination?: Pagination): Promise<Array<Player>>;
}
