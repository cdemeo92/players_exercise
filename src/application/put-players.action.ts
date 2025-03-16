import { Player } from './domain/player.entity';
import { PlayerRepositoryPort } from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';

export class PutPlayersResponse {
  private _success: boolean = true;
  public get success(): boolean {
    return this._success;
  }
  private _newPlayers: number = 0;
  public get newPlayers(): number {
    return this._newPlayers;
  }
  private _message?: string;
  public get message(): string | undefined {
    return this._message;
  }

  public setNewPlayers(newPlayers: number): PutPlayersResponse {
    this._newPlayers = newPlayers;
    return this;
  }

  public fail(message: string): PutPlayersResponse {
    this._success = false;
    this._message = message;
    return this;
  }
}

export class PutPlayersAction {
  public constructor(
    private readonly providerRepository: ProviderRepositoryPort,
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  public async execute(clubId: string): Promise<PutPlayersResponse> {
    const response = new PutPlayersResponse();
    try {
      const players = await this.providerRepository.getPlayersByClubId(clubId);
      await this.putPlayersForUpdate(players, response);
    } catch (error) {
      response.fail(`PUT PLAYERS ERROR: ${(error as Error).message}`);
    }

    return response;
  }

  private async putPlayersForUpdate(
    players: Player[],
    response: PutPlayersResponse,
  ): Promise<void> {
    if (players.length > 0) {
      const putPlayersResult = await this.playerRepository.putPlayers(players);
      if (putPlayersResult.insertedPlayers) {
        response.setNewPlayers(putPlayersResult.insertedPlayers);
      }
    }
  }
}
