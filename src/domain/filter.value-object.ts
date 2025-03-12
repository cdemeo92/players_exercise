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

  public getFilterObject(): Record<string, unknown> {
    return {
      ...(this.position !== undefined && { position: this.position }),
      ...(this.birthYearRange !== undefined && {
        birthYearRange: {
          ...(this.birthYearRange.start != undefined && {
            start: this.birthYearRange.start,
          }),
          ...(this.birthYearRange.end != undefined && {
            end: this.birthYearRange.end,
          }),
        },
      }),
      ...(this.isActive !== undefined && { isActive: this.isActive }),
      ...(this.clubId !== undefined && { clubId: this.clubId }),
    };
  }
}
