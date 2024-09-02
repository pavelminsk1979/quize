import { Injectable } from '@nestjs/common';
import { CreateQuestionInputModel } from '../api/pipes/create-question-input-model';
import { CreateQuestion } from '../api/tupes/dto';
import { Question } from '../domains/question.entity';
import { QuestionRepository } from '../../users/repositories/question-repository';

@Injectable()
export class QuestionService {
  constructor(protected questionRepository: QuestionRepository) {}

  async createQuestion(createQuestionInputModel: CreateQuestionInputModel) {
    const { body, correctAnswers } = createQuestionInputModel;

    const newQuestion: CreateQuestion = {
      body,
      correctAnswers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
    };

    const result: Question | null =
      await this.questionRepository.createNewQuestion(newQuestion);

    if (!result) return null;

    return {
      id: String(result.id),
      body: result.body,
      correctAnswers: result.correctAnswers,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      published: result.published,
    };
  }

  /*  async deleteUserById(userId: string) {
      return this.userSqlTypeormRepository.deleteUserById(userId);
    }*/
}
