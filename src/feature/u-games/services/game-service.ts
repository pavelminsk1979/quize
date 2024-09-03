import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from '../repositories/connection-repository';
import { ConnectionTabl } from '../domains/connection.entity';
import { GameRepository } from '../repositories/game-repository';
import { Connection, CreateGame } from '../api/types/dto';
import { QuestionRepository } from '../../u-questions/repositories/question-repository';

@Injectable()
export class GameService {
  constructor(
    protected connectionRepository: ConnectionRepository,
    protected gameRepository: GameRepository,
    protected questionRepository: QuestionRepository,
  ) {}

  async startGame(userId: string) {
    /* есть ли в таблице ConnectionTabl  запись
     со статусом   status:panding*/

    const connectionTabl: ConnectionTabl | null =
      await this.connectionRepository.findRowPanding();

    if (!connectionTabl) {
      /*     если нет ожидающего игрока, - создаю ИГРУ + 
             рандомные 5 вопросов к игре + создаю запись
           в таблице ConnectionTabl  с status:panding*/

      //создаю ИГРУ
      const newGame: CreateGame = {
        createdAt: new Date().toISOString(),
        isFinished: false,
      };
      const gameId: string = await this.gameRepository.createGame(newGame);

      /*создаю запись
      в таблице ConnectionTabl  с status:panding*/
      const newConnectionTabl: Connection = {
        createdAt: new Date().toISOString(),
        status: 'panding',
        idGameFK: gameId,
        idUserFK: userId,
      };

      const connectionId: string =
        await this.connectionRepository.createNewConnection(newConnectionTabl);

      /*рандомные 5 вопросов к игре
       -- 5 вопросов из таблицы Question
       --- потом делаю в таблице RandomQuestion 5 записей
       и в каждой записи одинаковые  gameId */
      const arrayRandomQuestions =
        await this.questionRepository.getRandomQuestions();
    }

    /*  а если один игрок уже ожидал - тогда 
      ЗАПУСКАЮ ИГРУ*/

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
