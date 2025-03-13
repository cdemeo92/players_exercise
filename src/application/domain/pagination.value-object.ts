export class Pagination {
  public constructor(
    private readonly page?: number,
    private readonly pageSize?: number,
  ) {}

  public getPage(): number {
    return this.page != undefined && this.page > 0 ? this.page : 1;
  }

  public getPageSize(defaultValue: number): number {
    return this.pageSize != undefined && this.pageSize > 0
      ? this.pageSize
      : defaultValue;
  }
}
