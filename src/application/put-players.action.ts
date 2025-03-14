import { Filter } from './domain/filter.value-object';
import { UPDATE_STATUS } from './domain/player.entity';
import {
  PlayerRepositoryPort,
  PurPlayersResult,
} from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';

export class PutPlayerResponse {
  public constructor(
    public readonly success: boolean,
    public readonly result?: PurPlayersResult,
    public readonly message?: string,
  ) {}
}

export class PutPlayersAction {
  public constructor(
    private readonly providerRepository: ProviderRepositoryPort,
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  public async execute(clubId: string): Promise<PutPlayerResponse> {
    try {
      const players = await this.providerRepository.getPlayersByClubId(clubId);
      if (players.length > 0) {
        const result = await this.playerRepository.putPlayers(players);
        const playersToUpdate = await this.playerRepository.getPlayers(
          new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
        );
        return new PutPlayerResponse(true, result);
      } else {
        return new PutPlayerResponse(
          true,
          undefined,
          `Club with id: ${clubId} not found`,
        );
      }
    } catch (error) {
      return new PutPlayerResponse(
        false,
        undefined,
        `PUT PLAYERS ERROR: ${(error as Error).message}`,
      );
    }
  }
}
