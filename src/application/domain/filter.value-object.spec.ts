import { BirthYearRange } from './filter.value-object';

describe('BirthYearRange', () => {
  describe('fromString', () => {
    it('should convert a stirng in the format AAAA-AAAA to an object with start year and end year', () => {
      expect(BirthYearRange.fromString('1990-2000')).toEqual({
        start: 1990,
        end: 2000,
      });
    });

    it('should set only the start year if the second year is not provided', () => {
      expect(BirthYearRange.fromString('1990')).toEqual({
        start: 1990,
      });
    });

    it('should set only the end year if the first year is not provided', () => {
      expect(BirthYearRange.fromString('-2000')).toEqual({
        start: 0,
        end: 2000,
      });
    });

    it('should not set the start and end year if the input is not valid', () => {
      expect(BirthYearRange.fromString('not-valid')).toEqual({});
    });
  });
});
