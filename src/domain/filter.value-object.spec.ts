import { BirthYearRange, Filter } from './filter.value-object';

describe('Filter', () => {
  describe('getFilterObject', () => {
    it('should return an empty object if Filter is instantiated without properties', () => {
      const filter = new Filter().getFilterObject();
      expect(filter).toStrictEqual({});
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('birthYearRange');
      expect(filter).not.toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only position if Filter is instantiated with position', () => {
      const filter = new Filter('position').getFilterObject();
      expect(filter).toStrictEqual({ position: 'position' });
      expect(filter).toHaveProperty('position');
      expect(filter).not.toHaveProperty('birthYearRange');
      expect(filter).not.toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only birthYearRange if Filter is instantiated with birthYearRange', () => {
      const birthYearRange = BirthYearRange.fromString('1990-2000');
      const filter = new Filter(undefined, birthYearRange).getFilterObject();
      expect(filter).toStrictEqual({
        birthYearRange: { start: 1990, end: 2000 },
      });
      expect(filter).toHaveProperty('birthYearRange');
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only tha start year in the birth year range if Filter is instantiated with only the start date', () => {
      const birthYearRange = new BirthYearRange(1990);
      const filter = new Filter(undefined, birthYearRange).getFilterObject();
      expect(filter).toStrictEqual({
        birthYearRange: { start: 1990 },
      });
      expect(filter).toHaveProperty('birthYearRange');
      expect(filter.birthYearRange).toHaveProperty('start');
      expect(filter.birthYearRange).not.toHaveProperty('end');
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only tha end year in the birth year range if Filter is instantiated with only the end date', () => {
      const birthYearRange = new BirthYearRange(undefined, 2000);
      const filter = new Filter(undefined, birthYearRange).getFilterObject();
      expect(filter).toStrictEqual({
        birthYearRange: { end: 2000 },
      });
      expect(filter).toHaveProperty('birthYearRange');
      expect(filter.birthYearRange).toHaveProperty('end');
      expect(filter.birthYearRange).not.toHaveProperty('start');
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only isActive if Filter is instantiated with isActive', () => {
      const filter = new Filter(undefined, undefined, true).getFilterObject();
      expect(filter).toStrictEqual({ isActive: true });
      expect(filter).toHaveProperty('isActive');
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('birthYearRange');
      expect(filter).not.toHaveProperty('clubId');
    });

    it('should return an object with only clubId if Filter is instantiated with clubId', () => {
      const filter = new Filter(
        undefined,
        undefined,
        undefined,
        'clubId',
      ).getFilterObject();
      expect(filter).toStrictEqual({ clubId: 'clubId' });
      expect(filter).toHaveProperty('clubId');
      expect(filter).not.toHaveProperty('position');
      expect(filter).not.toHaveProperty('birthYearRange');
      expect(filter).not.toHaveProperty('isActive');
    });

    it('should return an object with all properties if Filter is instantiated with all properties', () => {
      const birthYearRange = new BirthYearRange(1990, 2000);
      const filter = new Filter(
        'position',
        birthYearRange,
        true,
        'clubId',
      ).getFilterObject();
      expect(filter).toStrictEqual({
        position: 'position',
        birthYearRange: { start: 1990, end: 2000 },
        isActive: true,
        clubId: 'clubId',
      });
      expect(filter).toHaveProperty('position');
      expect(filter).toHaveProperty('birthYearRange');
      expect(filter).toHaveProperty('isActive');
      expect(filter).toHaveProperty('clubId');
    });
  });
});
