import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard } from '../../../common/guard/auth-token-guard';
import { Request } from 'express';
import { GameService } from '../services/game-service';
import { AnswerInputModel } from './pipes/answer-input-model';
import { ValidUUIDGuard } from '../../../common/guard/exist-game-guard';
import { QueryParamsGameInputModel } from '../../../common/pipes/query-params-game-input-model';
import { GameQueryRepository } from '../repositories/game-query-repository';
import { QueryParamStatisticInputModel } from '../../../common/pipes/query-param-statistic-input-model';
import { StatisticQueryRepository } from '../repositories/statistic-query-repository';

@Controller('pair-game-quiz')
export class GameController {
  constructor(
    protected gameService: GameService,
    protected gameQueryRepository: GameQueryRepository,
    protected statisticQueryRepository: StatisticQueryRepository,
  ) {}

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('pairs/connection')
  async startGame(@Req() request: Request) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const dataForGame = await this.gameService.startGame(userId);

    if (dataForGame) {
      return dataForGame;
    } else {
      /*вернут 403 если юзер текущий ожидает второго игрока*/
      throw new ForbiddenException(
        'error:andpoint-pair-game-quiz/pairs/connection,method-post',
      );
    }
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('pairs/my-current/answers')
  async setAnswer(
    @Body() answerInputModel: AnswerInputModel,
    @Req() request: Request,
  ) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const { answer } = answerInputModel;

    const dataAnswer = await this.gameService.setAnswer(userId, answer);

    if (dataAnswer) {
      return dataAnswer;
    } else {
      /*вернут 403 если юзер не имеет  пару со
      статусом ACTIVE или если ответил на все 5 вопросов
      * */
      throw new ForbiddenException(
        'error:andpoint-pair-game-quiz/pairs/my-current/answers,method-post',
      );
    }
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('pairs/my-current')
  async getGameUnfinished(@Req() request: Request) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const game = await this.gameService.getUnfinishedGame(userId);
    /*const game = await this.gameService.getGameById(userId, gameId);*/

    return game;
  }

  /* получить ВСЕ игры и завершонные и ТЕКУЩУЮ
 данного юзера   с  ПАГИНАЦИЕЙ И СОРТИРОВКОЙ*/
  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('pairs/my')
  async getAllGames(
    @Query() queryParamsGameInputModel: QueryParamsGameInputModel,
    @Req() request: Request,
  ) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const game = await this.gameQueryRepository.getAllGames(
      userId,
      queryParamsGameInputModel,
    );

    return game;
  }

  @UseGuards(AuthTokenGuard, ValidUUIDGuard)
  @HttpCode(HttpStatus.OK)
  @Get('pairs/:id')
  async getGameById(
    /*ParseIntPipe - это middleware в Nest.js
    Если значение параметра id не может быть преобразовано в число, будет выброшена ошибка 400 Bad Request*/
    @Param('id', ParseIntPipe) gameId: number,
    @Req() request: Request,
  ) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const game = await this.gameService.getGameById(userId, gameId.toString());

    return game;
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('users/my-statistic')
  async getStatisticMyGames(@Req() request: Request) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const statisticOneGame = await this.gameService.getStatisticMyGames(userId);

    return statisticOneGame;
  }

  @HttpCode(HttpStatus.OK)
  @Get('users/top')
  async getStatisticGamesWithPagination(
    @Query() queryParamStatisticInputModel: QueryParamStatisticInputModel,
  ) {
    const statisticGamesWithPagination =
      await this.statisticQueryRepository.getStatisticGamesWithPagination(
        queryParamStatisticInputModel,
      );
    console.log(statisticGamesWithPagination);
    return statisticGamesWithPagination;
  }
}
