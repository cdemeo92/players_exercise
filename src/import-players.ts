import { PlayerRepositoryPort } from './application/ports/player-repository.port';
import { ProviderRepositoryPort } from './application/ports/provider-repository.port';
import { PutPlayersAction } from './application/put-players.action';
import { UpdatePlayersAction } from './application/update-players.action';

export class ImportPlayers {
  private putPlayersAction: PutPlayersAction;
  private updatePlayersAction: UpdatePlayersAction;

  public constructor(
    providerRepository: ProviderRepositoryPort,
    playerRepository: PlayerRepositoryPort,
  ) {
    this.putPlayersAction = new PutPlayersAction(
      providerRepository,
      playerRepository,
    );
    this.updatePlayersAction = new UpdatePlayersAction(
      providerRepository,
      playerRepository,
    );
  }

  public async importPlayersById(clubId: string): Promise<void> {
    const putPlayersResult = await this.putPlayersAction.execute(clubId);
    if (putPlayersResult.success) {
      console.log(`Found ${putPlayersResult.newPlayers} new players`);
    } else {
      console.warn(
        'Got an error during the players fatching:',
        putPlayersResult.message,
      );
    }
    const updatePlayersResult = await this.updatePlayersAction.execute();
    if (updatePlayersResult.success) {
      console.log(`${updatePlayersResult.updatedPlayers} players imported`);
    } else {
      console.error(
        'Got an error during the players import:',
        updatePlayersResult.message,
      );
    }
  }
}
