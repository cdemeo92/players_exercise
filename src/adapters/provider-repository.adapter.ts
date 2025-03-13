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
}
