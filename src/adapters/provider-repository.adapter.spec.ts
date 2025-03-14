import axios from 'axios';
import { Player } from '../application/domain/player.entity';
import { ProviderRepositoryAdapter } from './provider-repository.adapter';

jest.mock('axios');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ProviderRepositoryAdapter', () => {
  const providerRepository = new ProviderRepositoryAdapter(
    'https://transfermarkt-api.fly.dev',
  );

  const axiosGetSpy = (axios.get as jest.Mock).mockResolvedValue({
    data: {
      updatedAt: '2025-03-13T20:25:57.613817',
      id: '5',
      players: Array(10).fill({
        id: '182906',
        name: 'Mike Maignan',
        position: 'Goalkeeper',
        dateOfBirth: '1995-07-03',
        age: 29,
        nationality: ['France', 'French Guiana'],
        height: 191,
        foot: 'right',
        joinedOn: '2021-07-01',
        signedFrom: 'LOSC Lille',
        contract: '2026-06-30',
        marketValue: 35000000,
        status: 'Team captain',
      }),
    },
  });

  describe('getPlayersByClubId', () => {
    it('should make a get query to the https://transfermarkt-api.fly.dev/clubs/5/players when the give clubId is 5', async () => {
      await providerRepository.getPlayersByClubId('5');
      expect(axiosGetSpy).toHaveBeenLastCalledWith(
        'https://transfermarkt-api.fly.dev/clubs/5/players',
      );
    });

    it('should return an array of Player', async () => {
      const response = await providerRepository.getPlayersByClubId('5');

      response.forEach((p) => expect(p).toBeInstanceOf(Player));
    });

    it('should return an array of Player with the same length of the received data', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: {
          updatedAt: '2025-03-13T20:25:57.613817',
          id: '5',
          players: Array(5).fill({
            id: '182906',
            name: 'Mike Maignan',
            position: 'Goalkeeper',
            dateOfBirth: '1995-07-03',
            age: 29,
            nationality: ['France', 'French Guiana'],
            height: 191,
            foot: 'right',
            joinedOn: '2021-07-01',
            signedFrom: 'LOSC Lille',
            contract: '2026-06-30',
            marketValue: 35000000,
            status: 'Team captain',
          }),
        },
      });
      const response = await providerRepository.getPlayersByClubId('5');

      expect(response.length).toBe(5);
    });

    it('should return an empty array when the request return an empty object', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({});
      expect(await providerRepository.getPlayersByClubId('5')).toEqual([]);
    });

    it('should return an empty array when the request return an empty array', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        players: [],
      });
      expect(await providerRepository.getPlayersByClubId('5')).toEqual([]);
    });
  });
});
