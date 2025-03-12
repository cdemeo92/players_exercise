import { Pagination } from './pagination.value-object';

describe('Pagination', () => {
  describe('getPage', () => {
    it('should return the page property if greather than 0', () => {
      expect(new Pagination(10).getPage()).toBe(10);
    });

    it('should return 1 if Pagination is instatiated with page 0', () => {
      expect(new Pagination(0).getPage()).toBe(1);
    });

    it('should return 1 if Pagination is instatiated with page less than 0', () => {
      expect(new Pagination(-1).getPage()).toBe(1);
    });

    it('should return 1 if Pagination is instatiated without page', () => {
      expect(new Pagination().getPage()).toBe(1);
    });
  });

  describe('getPageSize', () => {
    it('should return the pageSize property if greather than 0', () => {
      expect(new Pagination(undefined, 10).getPageSize(0)).toBe(10);
    });

    it('should return the defaultValue if Pagination is instatiated with page 0', () => {
      expect(new Pagination(undefined, 0).getPageSize(10)).toBe(10);
    });

    it('should return the defaultValue if with page less than 0', () => {
      expect(new Pagination(undefined, -1).getPageSize(10)).toBe(10);
    });

    it('should return the defaultValue if Pagination is instatiated without page', () => {
      expect(new Pagination().getPageSize(10)).toBe(10);
    });
  });
});
