import { Injectable } from '@nestjs/common';
import { QuestionInputModel } from '../api/pipes/create-question-input-model';
import { CreateQuestion } from '../api/types/dto';
import { QuestionRepository } from '../repositories/question-repository';
import { StatusPublishInputModel } from '../api/pipes/status-publish-input-model';

@Injectable()
export class QuestionService {
  constructor(protected questionRepository: QuestionRepository) {}

  async createQuestion(questionInputModel: QuestionInputModel) {
    const { body, correctAnswers } = questionInputModel;

    const newQuestion: CreateQuestion = {
      body,
      correctAnswers,
      createdAt: new Date().toISOString(),
      updatedAt: null,
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

    if (questionId.length > 5) return false;

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
  }

  async deleteQestionById(questionId: string) {
    if (questionId.length > 5) return false;

    const isExistQuestion =
      await this.questionRepository.getQuestionById(questionId);

    if (!isExistQuestion) return false;

    return this.questionRepository.deleteQestionById(questionId);
  }

  async updateStatusPublishForQuestion(
    questionId: string,
    statusPublishForQuestionInputModel: StatusPublishInputModel,
  ) {
    if (questionId.length > 5) return false;

    const isExistQuestion =
      await this.questionRepository.isExistQuestion(questionId);

    if (!isExistQuestion) return false;

    const newPublished = statusPublishForQuestionInputModel.published;

    return this.questionRepository.updateStatusPublishForQuestion(
      questionId,
      newPublished,
    );
  }
}
