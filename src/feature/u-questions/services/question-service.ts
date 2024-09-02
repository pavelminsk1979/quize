import { Injectable } from '@nestjs/common';
import { QuestionInputModel } from '../api/pipes/create-question-input-model';
import { CreateQuestion } from '../api/types/dto';
import { QuestionRepository } from '../repositories/question-repository';
import { InsertResult } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(protected questionRepository: QuestionRepository) {}

  async createQuestion(questionInputModel: QuestionInputModel) {
    const { body, correctAnswers } = questionInputModel;

    const newQuestion: CreateQuestion = {
      body,
      correctAnswers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
    };

    const result: string =
      await this.questionRepository.createNewQuestion(newQuestion);

    return result;
  }

  async updateQuestion(
    questionId: string,
    questionInputModel: QuestionInputModel,
  ) {
    const { body, correctAnswers } = questionInputModel;

    console.log(body);
    console.log(correctAnswers);

    const isExistQuestion =
      await this.questionRepository.isExistQuestion(questionId);

    if (!isExistQuestion) return false;

    return true;
  }

  /*  async deleteUserById(userId: string) {
      return this.userSqlTypeormRepository.deleteUserById(userId);
    }*/
}
