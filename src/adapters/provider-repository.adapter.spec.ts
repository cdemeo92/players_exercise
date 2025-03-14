import axios from 'axios';
import { Player } from '../application/domain/player.entity';
import { ProviderRepositoryAdapter } from './provider-repository.adapter';

jest.mock('axios');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ProviderRepositoryAdapter', () => {
  const providerRepository = new ProviderRepositoryAdapter(
    'https://transfermarkt-api.fly.dev',
  );

  const axiosGetSpy = (axios.get as jest.Mock).mockImplementation(
    (url: string) => {
      if (url.startsWith('https://transfermarkt-api.fly.dev/clubs')) {
        return Promise.resolve({
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
      } else {
        return Promise.resolve({
          data: {
            updatedAt: '2025-03-14T18:19:23.005588',
            id: '331726',
            url: 'https://www.transfermarkt.com/tammy-abraham/profil/spieler/331726',
            name: 'Tammy Abraham',
            description:
              'Tammy Abraham, 27, from England ➤ AC Milan, since 2024 ➤ Centre-Forward ➤ Market value: €20.00m ➤ * Oct 2, 1997 in London, England',
            nameInHomeCountry: 'Kevin Oghenetega Tamaraebi Bakumo-Abraham',
            imageUrl:
              'https://img.a.transfermarkt.technology/portrait/header/331726-1725531680.jpg?lm=1',
            dateOfBirth: '1997-10-02',
            placeOfBirth: {
              city: 'London',
              country: 'England',
            },
            age: 27,
            height: 194,
            citizenship: ['England', 'Nigeria'],
            isRetired: false,
            position: {
              main: 'Centre-Forward',
              other: [],
            },
            foot: 'right',
            shirtNumber: '#90',
            club: {
              id: '5',
              name: 'AC Milan',
              joined: '2024-08-30',
              contractExpires: '2025-06-30',
            },
            marketValue: 20000000,
            agent: {
              name: 'ROOF',
              url: '/roof/beraterfirma/berater/2295',
            },
            outfitter: 'Nike',
            socialMedia: [
              'http://twitter.com/tammyabraham',
              'http://www.instagram.com/tammyabraham/',
            ],
            trainerProfile: {},
            relatives: [
              {
                id: '506199',
                url: '/timmy-abraham/profil/spieler/506199',
                name: 'Timmy Abraham',
                profileType: 'player',
              },
            ],
          },
        });
      }
    },
  );

  describe('getPlayersByClubId', () => {
    it('should make a get request to the https://transfermarkt-api.fly.dev/clubs/5/players when the give clubId is 5', async () => {
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

  describe('getPlayerActiveStatus', () => {
    it('should make a get request to the https://transfermarkt-api.fly.dev/players/331726/profile when the give player id is 331726', async () => {
      await providerRepository.getPlayerActiveStatus('331726');
      expect(axiosGetSpy).toHaveBeenLastCalledWith(
        'https://transfermarkt-api.fly.dev/players/331726/profile',
      );
    });

    it('should return the true when isRetired is false', async () => {
      axiosGetSpy.mockResolvedValueOnce({
        data: {
          isRetired: false,
        },
      });
      const isActive = await providerRepository.getPlayerActiveStatus('331726');
      expect(isActive).toBeTruthy();
    });

    it('should return the false when isRetired is true', async () => {
      axiosGetSpy.mockResolvedValueOnce({
        data: {
          isRetired: true,
        },
      });
      const isActive = await providerRepository.getPlayerActiveStatus('331726');
      expect(isActive).toBeFalsy();
    });

    it('should throw if the request return an empty object', async () => {
      axiosGetSpy.mockResolvedValueOnce({ data: {} });
      await expect(
        providerRepository.getPlayerActiveStatus('331726'),
      ).rejects.toThrow(
        'ProviderRepositoryAdapter.getPlayerActiveStatus ERROR: unable to fatch retiring status',
      );
    });
  });
});
