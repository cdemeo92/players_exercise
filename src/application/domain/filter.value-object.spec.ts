import { BirthYearRange, Filter } from './filter.value-object';
import { UPDATE_STATUS } from './player.entity';

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

describe('Filter', () => {
  it('should create a filter with updateStatus UPDATED by default', () => {
    expect(new Filter({})).toEqual({ updateStatus: UPDATE_STATUS.UPDATED });
  });

  it('should create a filter with updateStatus TO_UPDATE when provided', () => {
    expect(new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE })).toEqual({
      updateStatus: UPDATE_STATUS.TO_UPDATE,
    });
  });
});
