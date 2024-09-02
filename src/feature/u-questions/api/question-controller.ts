import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { CreateQuestionInputModel } from './pipes/create-question-input-model';
import { QuestionService } from '../services/question-service';

@UseGuards(AuthGuard)
@Controller('sa/quiz/questions')
export class QuestionController {
  constructor(protected questionService: QuestionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createQuestion(
    @Body() createQuestionInputModel: CreateQuestionInputModel,
  ) {
    const question = await this.questionService.createQuestion(
      createQuestionInputModel,
    );

    if (question) {
      return question;
    } else {
      /*HTTP-код 404*/
      throw new NotFoundException('user not found:andpoint-post,url-users');
    }
  }

  /*  @Get()
    async getUsers(@Query() queryParamsUserInputModel: QueryParamsInputModel) {
      const users = await this.userQuerySqlRepository.getUsers(
        queryParamsUserInputModel,
      );
      return users;
    }*/

  /*  @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteUserById(@Param('id') userId: string) {
      const isDeleteUserById = await this.usersService.deleteUserById(userId);
      if (isDeleteUserById) {
        return;
      } else {
        /!*соответствует HTTP статус коду 404*!/
        throw new NotFoundException(
          'user not found:andpoint-delete,url-users/id',
        );
      }
    }*/
}
