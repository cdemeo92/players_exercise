import { UPDATE_STATUS } from './player.entity';

export class BirthYearRange {
  public constructor(
    public readonly start?: number,
    public readonly end?: number,
  ) {}

  public static fromString(birthYearRange: string): BirthYearRange {
    const [start, end] = birthYearRange.split('-').map(Number);
    return new BirthYearRange(
      !isNaN(start) ? start : undefined,
      !isNaN(end) ? end : undefined,
    );
  }
}

export class Filter {
  public readonly position?: string;
  public readonly birthYearRange?: BirthYearRange;
  public readonly isActive?: boolean;
  public readonly clubId?: string;
  public readonly updateStatus: UPDATE_STATUS = UPDATE_STATUS.UPDATED;
  public constructor(filter: {
    position?: string;
    birthYearRange?: BirthYearRange;
    isActive?: boolean;
    clubId?: string;
    updateStatus?: UPDATE_STATUS;
  }) {
    this.clubId = filter.clubId;
    this.isActive = filter.isActive;
    this.position = filter.position;
    this.birthYearRange = filter.birthYearRange;
    this.updateStatus = filter.updateStatus ?? UPDATE_STATUS.UPDATED;
  }
}
