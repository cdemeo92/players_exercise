import { Inject, Injectable } from '@nestjs/common';
import { Filter, Pagination } from 'src/domain/filter.value-object';
import { Player } from 'src/domain/player.entity';
import { PlayerRepositoryPort } from './ports/player-repository.port';

@Injectable()
export class GetPlayersAction {
  public constructor(
    @Inject('PlayerRepositoryPort')
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  execute(params?: Filter, pagination?: Pagination): Promise<Array<Player>> {
    try {
      return this.playerRepository.getPlayers(params, pagination);
    } catch (error) {
      throw new Error(
        `An error occurred while fetching players: ${(error as Error).message}`,
      );
    }
  }
}
