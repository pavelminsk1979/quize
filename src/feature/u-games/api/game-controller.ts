import {
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard } from '../../../common/guard/auth-token-guard';
import { Request } from 'express';
import { GameService } from '../services/game-service';

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
}
