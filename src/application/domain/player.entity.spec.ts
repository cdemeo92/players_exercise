import { Player } from './player.entity';

describe('Player', () => {
  const player = {
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
  };

  it('should create a player with the given properties', () => {
    expect(new Player(player)).toMatchObject(player);
  });

  describe('setIsActive', () => {
    it('should change the active status', () => {
      const p = new Player(player);
      expect(p.isActive).toBeUndefined();
      p.setIsActive(true);
      expect(p.isActive).toBeTruthy();
      p.setIsActive(false);
      expect(p.isActive).toBeFalsy();
      p.setIsActive(true);
      expect(p.isActive).toBeTruthy();
    });
  });
});
