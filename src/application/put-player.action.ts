import { PlayerRepositoryPort } from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';

export class PutPlayerResult {
  public constructor(
    public readonly success: boolean,
    public readonly message?: string,
  ) {}
}

export class PutPlayersAction {
  public constructor(
    private readonly providerRepository: ProviderRepositoryPort,
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  public async execute(clubId: string): Promise<PutPlayerResult> {
    try {
      const players = await this.providerRepository.getPlayersByClubId(clubId);
      if (players.length > 0) {
        await this.playerRepository.putPlayers(players);
        return new PutPlayerResult(true);
      } else {
        return new PutPlayerResult(true, `Club with id: ${clubId} not found`);
      }
    } catch (error) {
      return new PutPlayerResult(
        false,
        `PUT PLAYERS ERROR: ${(error as Error).message}`,
      );
    }
  }
}
