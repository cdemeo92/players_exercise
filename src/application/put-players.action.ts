import { Filter } from './domain/filter.value-object';
import { Player, UPDATE_STATUS } from './domain/player.entity';
import {
  GetPlayersResult,
  PlayerRepositoryPort,
} from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';

export class PutPlayerResponse {
  private success: boolean = true;
  private updatedPlayers: number = 0;
  private newPlayers: number = 0;
  private message?: string;

  public toObject(): Record<string, unknown> {
    return {
      success: this.success,
      updatedPlayers: this.updatedPlayers,
      newPlayers: this.newPlayers,
      message: this.message,
    };
  }

  public increaseUpdatedPlayers(): PutPlayerResponse {
    this.updatedPlayers++;
    return this;
  }

  public setNewPlayers(newPlayers: number): PutPlayerResponse {
    this.newPlayers = newPlayers;
    return this;
  }

  public setMessage(message: string): PutPlayerResponse {
    this.message = message;
    return this;
  }

  public fail(message: string): PutPlayerResponse {
    this.success = false;
    this.message = message;
    return this;
  }
}

export class PutPlayersAction {
  public constructor(
    private readonly providerRepository: ProviderRepositoryPort,
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  public async execute(clubId: string): Promise<Record<string, unknown>> {
    const response = new PutPlayerResponse();
    try {
      const players = await this.providerRepository.getPlayersByClubId(clubId);
      await this.putPlayersForUpdate(players, response);
      const playersToUpdate = await this.playerRepository.getPlayers(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
      );

      await this.forEachPlayerUpdateIsActive(playersToUpdate, response);
    } catch (error) {
      response.fail(`PUT PLAYERS ERROR: ${(error as Error).message}`);
    }

    return response.toObject();
  }

  private async putPlayersForUpdate(
    players: Player[],
    response: PutPlayerResponse,
  ): Promise<void> {
    if (players.length > 0) {
      const putPlayersResult = await this.playerRepository.putPlayers(players);
      if (putPlayersResult.insertedPlayers) {
        response.setNewPlayers(putPlayersResult.insertedPlayers);
      }
    }
  }

  private async forEachPlayerUpdateIsActive(
    playersToUpdate: GetPlayersResult,
    response: PutPlayerResponse,
  ): Promise<void> {
    if (playersToUpdate.players.length > 0) {
      for (const player of playersToUpdate.players) {
        await this.updateIsActiveFor(player);
        response.increaseUpdatedPlayers();
      }
    }
  }

  private async updateIsActiveFor(player: Player): Promise<void> {
    const isActive = await this.providerRepository.getPlayerActiveStatus(
      player.id,
    );
    player.setIsActive(isActive);
    await this.playerRepository.putPlayers([player], true);
  }
}
