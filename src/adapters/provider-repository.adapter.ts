import axios from 'axios';
import { Player } from '../application/domain/player.entity';
import { ProviderRepositoryPort } from '../application/ports/provider-repository.port';

export class ProviderRepositoryAdapter implements ProviderRepositoryPort {
  public constructor(private readonly domain: string) {}

  public async getPlayersByClubId(clubId: string): Promise<Array<Player>> {
    console.log(
      `PUT PLAYERS JOB: get players of club ${clubId} from ${this.domain}`,
    );
    const response = await axios.get<{ players: Player[] }>(
      `${this.domain}/clubs/${clubId}/players`,
    );

    console.log(
      `PUT PLAYERS JOB: ${response.data?.players?.length ?? 0} players found`,
    );
    return (
      response.data?.players?.map(
        (player) => new Player({ ...player, clubId }),
      ) || []
    );
  }

  public async getPlayerActiveStatus(playerId: string): Promise<boolean> {
    console.log(
      `PUT PLAYERS JOB: get player ${playerId} retiring status from ${this.domain}`,
    );
    const response = await axios.get<{ isRetired: boolean }>(
      `${this.domain}/players/${playerId}/profile`,
    );

    if (!response.data || response.data.isRetired === undefined) {
      throw new Error(
        'ProviderRepositoryAdapter.getPlayerActiveStatus ERROR: unable to fatch retiring status',
      );
    }

    console.log(
      `PUT PLAYERS JOB: player ${playerId}`,
      response.data?.isRetired ? 'retired' : 'active',
    );

    return !response.data.isRetired;
  }
}
