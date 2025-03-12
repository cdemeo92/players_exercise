export class BirthYearRange {
  public constructor(
    public readonly start?: number,
    public readonly end?: number,
  ) {}

  public static fromString(birthYearRange: string): BirthYearRange {
    const [start, end] = birthYearRange.split('-').map(Number);
    return new BirthYearRange(start, end);
  }
}

export class Filter {
  public constructor(
    public readonly position?: string,
    public readonly birthYearRange?: BirthYearRange,
    public readonly isActive?: boolean,
    public readonly clubId?: string,
  ) {}
}
