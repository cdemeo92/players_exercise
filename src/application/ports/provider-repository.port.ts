import { Player } from '../../domain/player.entity';

export interface ProviderRepositoryPort {
  getPlayersByClubId(clubId: string): Promise<Array<Player>>;
}
