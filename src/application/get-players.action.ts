import { Inject, Injectable } from '@nestjs/common';
import { Filter } from '../domain/filter.value-object';
import { Pagination } from '../domain/pagination.value-object';
import {
  GetPlayersResult,
  PlayerRepositoryPort,
} from './ports/player-repository.port';

@Injectable()
export class GetPlayersAction {
  public constructor(
    @Inject('PlayerRepositoryPort')
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  execute(params?: Filter, pagination?: Pagination): Promise<GetPlayersResult> {
    try {
      return this.playerRepository.getPlayers(params, pagination);
    } catch (error) {
      throw new Error(
        `An error occurred while fetching players: ${(error as Error).message}`,
      );
    }
  }
}
