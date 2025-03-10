import { ApiProperty } from '@nestjs/swagger';

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
}

export class GetPlayersResponse {
  @ApiProperty({
    description: 'The club the player is playing for',
    required: false,
    type: String,
  })
  club?: string;
}
