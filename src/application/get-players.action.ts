import { Injectable } from '@nestjs/common';
import { GetPlayersParams, GetPlayersResponse } from './dto/get-players.dto';

@Injectable()
export class GetPlayersAction {
  execute(params: GetPlayersParams): GetPlayersResponse[] {
    console.log(params);
    return [];
  }
}
