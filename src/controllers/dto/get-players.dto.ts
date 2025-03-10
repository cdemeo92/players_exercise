import { ApiProperty } from '@nestjs/swagger';
import {
  BirthYearRange,
  Filter,
  Pagination,
} from '../../domain/filter.value-object';

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

  @ApiProperty({
    description: 'The page number to retrieve',
    required: false,
    type: Number,
  })
  page?: number;

  @ApiProperty({
    description: 'The number of players to retrieve per page',
    required: false,
    type: Number,
  })
  pageSize?: number;

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

  public toPagination(): Pagination {
    return { page: this.page, pageSize: this.pageSize };
  }
}

export class Player {
  @ApiProperty({ description: 'The player id', type: 'string' })
  id: string;

  @ApiProperty({ description: 'The player name', type: 'string' })
  name: string;

  @ApiProperty({ description: 'The player position', type: 'string' })
  position: string;

  @ApiProperty({ description: 'The player date of birth', type: 'string' })
  dateOfBirth: string;

  @ApiProperty({ description: 'The player age', type: 'number' })
  age: number;

  @ApiProperty({
    description: 'The player nationality',
    type: 'string',
    isArray: true,
  })
  nationality: string[];

  @ApiProperty({ description: 'The player height', type: 'number' })
  height: number;

  @ApiProperty({ description: 'The player foot', type: 'string' })
  foot: string;

  @ApiProperty({
    description: 'The date the player joined the club',
    type: 'string',
  })
  joinedOn: string;

  @ApiProperty({
    description: 'The club the player was signed from',
    type: 'string',
  })
  signedFrom: string;

  @ApiProperty({ description: 'The player contract end date', type: 'string' })
  contract: string;

  @ApiProperty({ description: 'The player market value', type: 'number' })
  marketValue: number;

  @ApiProperty({ description: 'The player status', type: 'string' })
  status: string;

  @ApiProperty({
    description: 'Whether or not the player is still active',
    type: 'boolean',
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The club id the player is playing for',
    type: 'string',
  })
  clubId: string;
}

export class GetPlayersResponse {
  @ApiProperty({
    description: 'The list of players',
    type: [Player],
  })
  players: Player[];

  @ApiProperty({
    description: 'The current page number',
    type: 'number',
  })
  page: number;

  @ApiProperty({
    description: 'The number of players per page',
    type: 'number',
  })
  pageSize: number;

  @ApiProperty({
    description: 'The total number of pages',
    type: 'number',
  })
  totalPage: number;
}
