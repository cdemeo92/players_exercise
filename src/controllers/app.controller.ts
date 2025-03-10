import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetPlayersParams,
  GetPlayersResponse,
} from '../application/dto/get-players.dto';
import { GetPlayersAction } from '../application/get-players.action';

@Controller('players')
@ApiTags('players')
export class AppController {
  constructor(private readonly getPlayersAction: GetPlayersAction) {}

  @Get()
  @ApiOperation({
    summary:
      'Returns players filtered by position, birth year range, active status, and club',
  })
  @ApiOkResponse({
    description:
      'Players filtered by position, birth year range, active status, and club',
    type: [GetPlayersResponse],
  })
  getPlayers(@Query() params?: GetPlayersParams): GetPlayersResponse[] {
    return this.getPlayersAction.execute(params);
  }
}
