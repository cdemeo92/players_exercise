import { ApiProperty } from '@nestjs/swagger';
import { BirthYearRange, Filter } from '../../domain/filter.value-object';

export class GetPlayersParams {
  @ApiProperty({
    required: false,
    description: 'The position of a player in the club',
    type: String,
  })
  position?: string;

  @ApiProperty({
    description: 'The range of birth years of the players',
    required: false,
    type: String,
  })
  birthYearRange?: string;

  @ApiProperty({
    description:
      'Wheter or not the player is still active. When not specified, all players are returned.',
    default: undefined,
    required: false,
    type: Boolean,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'The club the player is playing for',
    required: false,
    type: String,
  })
  club?: string;

  public toFilter(): Filter {
    return new Filter(
      this.position,
      this.birthYearRange
        ? BirthYearRange.fromString(this.birthYearRange)
        : undefined,
      this.isActive,
      this.club,
    );
  }
}

export class GetPlayersResponse {
  @ApiProperty({
    description: 'The club the player is playing for',
    required: false,
    type: String,
  })
  club?: string;
}
