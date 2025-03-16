import { Filter } from './domain/filter.value-object';
import { Player, UPDATE_STATUS } from './domain/player.entity';
import {
  GetPlayersResult,
  PlayerRepositoryPort,
} from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';

export class UpdatePlayersResponse {
  private _success: boolean = true;
  public get success(): boolean {
    return this._success;
  }
  private _updatedPlayers: number = 0;
  public get updatedPlayers(): number {
    return this._updatedPlayers;
  }

  private _message?: string;
  public get message(): string | undefined {
    return this._message;
  }
  private _skipped: string[] = [];
  public get skipped(): string[] {
    return this._skipped;
  }

  public increaseUpdatedPlayers(): UpdatePlayersResponse {
    this._updatedPlayers++;
    return this;
  }

  public addToSkipped(id: string): UpdatePlayersResponse {
    this._skipped.push(id);
    return this;
  }

  public fail(message: string): UpdatePlayersResponse {
    this._success = false;
    this._message = message;
    return this;
  }
}

export class UpdatePlayersAction {
  public constructor(
    private readonly providerRepository: ProviderRepositoryPort,
    private readonly playerRepository: PlayerRepositoryPort,
  ) {}

  public async execute(): Promise<UpdatePlayersResponse> {
    const response = new UpdatePlayersResponse();
    try {
      const playersToUpdate = await this.playerRepository.getPlayers(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
      );
      await this.forEachPlayerUpdateIsActive(playersToUpdate, response);
    } catch (error) {
      response.fail(`UPDATE PLAYERS ERROR: ${(error as Error).message}`);
    }
    return response;
  }

  private async forEachPlayerUpdateIsActive(
    playersToUpdate: GetPlayersResult,
    response: UpdatePlayersResponse,
  ): Promise<void> {
    if (playersToUpdate.players.length > 0) {
      for (const player of playersToUpdate.players) {
        try {
          await this.updateIsActiveFor(player);
          response.increaseUpdatedPlayers();
        } catch (error) {
          console.log(`UpdatePlayersAction Error ${(error as Error).message}`);
          response.addToSkipped(player.id);
        }
      }
    } else {
      console.log('0 players to insert');
    }
  }

  private async updateIsActiveFor(player: Player): Promise<void> {
    const isActive = await this.providerRepository.getPlayerActiveStatus(
      player.id,
    );
    player.setIsActive(isActive);
    console.log(`Saving player ${player.id}`);
    await this.playerRepository.putPlayers([player], true);
  }
}
