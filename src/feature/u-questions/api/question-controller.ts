import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { QuestionInputModel } from './pipes/create-question-input-model';
import { QuestionService } from '../services/question-service';
import { QuestionQueryRepository } from '../repositories/question-query-repository';
import { QueryParamsQuestionInputModel } from '../../../common/pipes/query-params-question-input-model';

@UseGuards(AuthGuard)
@Controller('sa/quiz/questions')
export class QuestionController {
  constructor(
    protected questionService: QuestionService,
    protected questionQueryRepository: QuestionQueryRepository,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createQuestion(@Body() questionInputModel: QuestionInputModel) {
    const questionId =
      await this.questionService.createQuestion(questionInputModel);

    const question =
      await this.questionQueryRepository.getQuestionById(questionId);

    if (question) {
      return question;
    } else {
      /*HTTP-код 404*/
      throw new NotFoundException(
        'error:andpoint-sa/quiz/questions,method-post',
      );
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
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
  }

  @HttpCode(HttpStatus.NO_CONTENT)
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
  }

  @Get()
  async getQestions(
    @Query() queryParamsQuestionInputModel: QueryParamsQuestionInputModel,
  ) {
    const qestions = await this.questionQueryRepository.getQestions(
      queryParamsQuestionInputModel,
    );

    return qestions;
  }
}
