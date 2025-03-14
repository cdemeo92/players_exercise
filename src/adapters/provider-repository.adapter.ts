import axios from 'axios';
import { Player } from '../application/domain/player.entity';
import { ProviderRepositoryPort } from '../application/ports/provider-repository.port';

export class ProviderRepositoryAdapter implements ProviderRepositoryPort {
  public constructor(private readonly domain: string) {}

  public async getPlayersByClubId(clubId: string): Promise<Array<Player>> {
    const response = await axios.get<{ players: Player[] }>(
      `${this.domain}/clubs/${clubId}/players`,
    );

    return (
      response.data?.players?.map(
        (player) => new Player({ ...player, clubId }),
      ) || []
    );
  }

  public async getPlayerActiveStatus(playerId: string): Promise<boolean> {
    const response = await axios.get<{ isRetired: boolean }>(
      `${this.domain}/players/${playerId}/profile`,
    );

    if (!response.data || response.data.isRetired === undefined) {
      throw new Error(
        'ProviderRepositoryAdapter.getPlayerActiveStatus ERROR: unable to fatch retiring status',
      );
    }

    return !response.data.isRetired;
  }
}
