import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard } from '../../../common/guard/auth-token-guard';
import { Request } from 'express';
import { GameService } from '../services/game-service';
import { AnswerInputModel } from './pipes/answer-input-model';

@Controller('pair-game-quiz/pairs')
export class GameController {
  constructor(protected gameService: GameService) {}

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('connection')
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
  @Post('my-current/answers')
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
  @Get(':id')
  async getGameById(@Param('id') gameId: string, @Req() request: Request) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const game = await this.gameService.getGameById(userId, gameId);

    return game;
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('my-current')
  async getUnfinishedGame(@Req() request: Request) {
    debugger;
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const game = await this.gameService.getUnfinishedGame(userId);

    return game;
  }
}

/*  @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':id')
    async updateQuestion(
      @Param('id') questionId: string,
      @Body() questionInputModel: QuestionInputModel,
    ) {
      const isUpdateQuestion: boolean = await this.questionService.updateQuestion(
        questionId,
        questionInputModel,
      );
  
      if (isUpdateQuestion) {
        return;
      } else {
        throw new NotFoundException(
          'question  not exist :method-put ,url /sa/quiz/questions/id',
        );
      }
    }*/

/*  @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteQestionById(@Param('id') questionId: string) {
      const isDeleteQestionById =
        await this.questionService.deleteQestionById(questionId);
      if (isDeleteQestionById) {
        return;
      } else {
        //соответствует HTTP статус коду 404
        throw new NotFoundException(
          'question not found:andpoint-sa/quiz/questions/id,method-delete',
        );
      }
    }*/

/*  @Get()
    async getQestions(
      @Query() queryParamsQuestionInputModel: QueryParamsQuestionInputModel,
    ) {
      const qestions = await this.questionQueryRepository.getQestions(
        queryParamsQuestionInputModel,
      );
  
      return qestions;
    }*/

/*  @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':id/publish')
    async updateStatusPublishForQuestion(
      @Param('id') questionId: string,
      @Body() statusPublishForQuestionInputModel: StatusPublishInputModel,
    ) {
      const isUpdateStatusPublishForQuestion: boolean =
        await this.questionService.updateStatusPublishForQuestion(
          questionId,
          statusPublishForQuestionInputModel,
        );
  
      if (isUpdateStatusPublishForQuestion) {
        return;
      } else {
        throw new NotFoundException(
          'question  not exist :method-put ,url /sa/quiz/questions/id/publish',
        );
      }
    }*/
