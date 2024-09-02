import { Injectable } from '@nestjs/common';
import { Question } from '../domains/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewModelOneQuestion } from '../api/types/views';

@Injectable()
export class QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async getQuestionById(questionId: string) {
    const result = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.id=:questionId', { questionId })
      .getOne();

    if (!result) return false;

    const viewModel: ViewModelOneQuestion =
      this.createViewModelOneQuestion(result);

    return viewModel;
  }

  createViewModelOneQuestion(result: Question): ViewModelOneQuestion {
    return {
      id: String(result.id),
      body: result.body,
      correctAnswers: result.correctAnswers,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      published: result.published,
    };
  }
}
