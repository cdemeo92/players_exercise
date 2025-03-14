import { Player, UPDATE_STATUS } from './player.entity';

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

  it('should set updateStatus to 0 when not provided', () => {
    expect(new Player(player).toObject().updateStatus).toBe(
      UPDATE_STATUS.TO_UPDATE,
    );
  });

  it('should set updateStatus to 0 when provided ad is equal to TO_BE_UPDATED', () => {
    expect(
      new Player({ ...player, updateStatus: 0 }).toObject().updateStatus,
    ).toBe(UPDATE_STATUS.TO_UPDATE);
  });

  it('should set updateStatus to 1 when provided ad is equal to UPDATED', () => {
    expect(
      new Player({ ...player, updateStatus: 1 }).toObject().updateStatus,
    ).toBe(UPDATE_STATUS.UPDATED);
  });

  it('should set updateStatus as TO_BE_UPDATED when not valid', () => {
    expect(
      new Player({ ...player, updateStatus: 'not_valid' }).toObject()
        .updateStatus,
    ).toBe(UPDATE_STATUS.TO_UPDATE);
  });

  describe('setIsActive', () => {
    it('should change the active status', () => {
      const p = new Player(player);
      expect(p.toObject().isActive).toBeUndefined();
      p.setIsActive(true);
      expect(p.toObject().isActive).toBeTruthy();
      p.setIsActive(false);
      expect(p.toObject().isActive).toBeFalsy();
      p.setIsActive(true);
      expect(p.toObject().isActive).toBeTruthy();
    });

    it('should change the update status to UPDAED', () => {
      const p = new Player(player);
      expect(p.toObject().updateStatus).toBe(UPDATE_STATUS.TO_UPDATE);
      p.setIsActive(true);
      expect(p.toObject().updateStatus).toBe(UPDATE_STATUS.UPDATED);
    });
  });

  describe('toObject', () => {
    it('should not return the updateStatus', () => {});
  });
});
