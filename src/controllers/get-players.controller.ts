import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPlayersAction } from '../application/get-players.action';
import { GetPlayersParams, GetPlayersResponse } from './dto/get-players.dto';

@Controller('players')
@ApiTags('players')
export class GetPlayersController {
  constructor(private readonly getPlayersAction: GetPlayersAction) {}

  @Get()
  @ApiOperation({
    summary:
      'Returns players filtered by position, birth year range, active status, and club',
  })
  @ApiOkResponse({
    description:
      'Players filtered by position, birth year range, active status, and club',
    type: GetPlayersResponse,
  })
  async getPlayers(
    @Query() params?: GetPlayersParams,
  ): Promise<GetPlayersResponse> {
    try {
      return new GetPlayersResponse(
        await this.getPlayersAction.execute(
          params?.toFilter(),
          params?.toPagination(),
        ),
      );
    } catch (error) {
      throw new HttpException(
        `Server Error: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
