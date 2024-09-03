import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from '../repositories/connection-repository';

@Injectable()
export class GameService {
  constructor(protected connectionRepository: ConnectionRepository) {}

  async startGame(userId: string) {
    /* есть ли в таблице ConnectionTabl  запись
     со статусом   status:panding*/

    const isPandingGame: boolean =
      await this.connectionRepository.findRowPanding();

    return userId;
  }
}

/*  async createQuestion(questionInputModel: QuestionInputModel) {
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
  }*/

/*  async updateQuestion(
    questionId: string,
    questionInputModel: QuestionInputModel,
  ) {
    const { body, correctAnswers } = questionInputModel;

    const isExistQuestion =
      await this.questionRepository.isExistQuestion(questionId);

    if (!isExistQuestion) return false;

    const newUpdatedAt = new Date().toISOString();

    const newBody = body;

    const newCorrectAnswers = correctAnswers;

    return this.questionRepository.updateQuestion(
      questionId,
      newUpdatedAt,
      newBody,
      newCorrectAnswers,
    );
  }*/

/*  async deleteQestionById(questionId: string) {
    return this.questionRepository.deleteQestionById(questionId);
  }*/

/*  async updateStatusPublishForQuestion(
    questionId: string,
    statusPublishForQuestionInputModel: StatusPublishInputModel,
  ) {
    const isExistQuestion =
      await this.questionRepository.isExistQuestion(questionId);

    if (!isExistQuestion) return false;

    const newPublished = statusPublishForQuestionInputModel.published;

    return this.questionRepository.updateStatusPublishForQuestion(
      questionId,
      newPublished,
    );
  }*/
