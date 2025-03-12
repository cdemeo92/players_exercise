import { Filter } from '../../domain/filter.value-object';
import { Pagination } from '../../domain/pagination.value-object';
import { Player } from '../../domain/player.entity';

export interface GetPlayersResult {
  players: Array<Player>;
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PlayerRepositoryPort {
  getPlayers(
    filter?: Filter,
    pagination?: Pagination,
  ): Promise<GetPlayersResult>;
}
