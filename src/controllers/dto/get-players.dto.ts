import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetPlayersResult } from 'src/application/ports/player-repository.port';
import { BirthYearRange, Filter } from '../../domain/filter.value-object';
import { Pagination } from '../../domain/pagination.value-object';

//TODO: add e2e test for parameters validation and serialization
export class GetPlayersParams {
  @ApiProperty({
    required: false,
    description: 'The position of a player in the club',
    type: String,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: 'The range of birth years of the players',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  birthYearRange?: string;

  @ApiProperty({
    description:
      'Wheter or not the player is still active. When not specified, all players are returned.',
    default: undefined,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => !!value)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'The club the player is playing for',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  clubId?: string;

  @ApiProperty({
    description: 'The page number to retrieve',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && parseInt(value)) ?? 1)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: 'The number of players to retrieve per page',
    required: false,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === 'string' && parseInt(value)) ?? 10,
  )
  @IsNumber()
  pageSize?: number = 10;

  public constructor(query?: Partial<GetPlayersParams>) {
    Object.assign(this, query);
  }

  @Type(() => GetPlayersParams)
  static fromQuery(query: Partial<GetPlayersParams>): GetPlayersParams {
    return new GetPlayersParams(query);
  }

  public toFilter(): Filter {
    return new Filter(
      this.position,
      this.birthYearRange
        ? BirthYearRange.fromString(this.birthYearRange)
        : undefined,
      this.isActive,
      this.clubId,
    );
  }

  public toPagination(): Pagination {
    return new Pagination(this.page, this.pageSize);
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

  public constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }
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
    description: 'The total number of players with the given filter',
    type: 'number',
  })
  totalCount: number;

  public constructor(playerResult: GetPlayersResult) {
    this.page = playerResult.page;
    this.pageSize = playerResult.pageSize;
    this.totalCount = playerResult.totalCount;
    this.players = playerResult.players.map((player) => new Player(player));
  }
}
