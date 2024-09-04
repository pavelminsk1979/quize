import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from '../repositories/connection-repository';
import { ConnectionTabl } from '../domains/connection.entity';
import { GameRepository } from '../repositories/game-repository';
import { Connection, CreateGame, Random } from '../api/types/dto';
import { QuestionRepository } from '../../u-questions/repositories/question-repository';
import { UserSqlTypeormRepository } from '../../users/repositories/user-sql-typeorm-repository';
import { Question } from '../../u-questions/domains/question.entity';
import { RandomQuestionRepository } from '../repositories/random-question-repository';

@Injectable()
export class GameService {
  constructor(
    protected connectionRepository: ConnectionRepository,
    protected gameRepository: GameRepository,
    protected questionRepository: QuestionRepository,
    protected userSqlTypeormRepository: UserSqlTypeormRepository,
    protected randomQuestionRepository: RandomQuestionRepository,
  ) {}

  async startGame(userId: string) {
    /*есть ли такой ЮЗЕР и дальше по коду 
    понадобится запись-юзер  чтоб  связь 
    между таблицами сделать*/

    const user = await this.userSqlTypeormRepository.getUserById(userId);

    if (!user) return null;

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

      /*надо получить запись-game чтобы создать связь
      между таблицами ConnectionTabl и Game*/

      const game = await this.gameRepository.getGameById(gameId);

      if (!game) return null;

      /*создаю запись
      в таблице ConnectionTabl  с status:panding*/
      const newConnectionTabl: Connection = {
        createdAt: new Date().toISOString(),
        status: 'panding',
        idGameFK: gameId,
        idUserFK: userId,
        usertyp: user,
        game: game,
      };

      const connectionId: string =
        await this.connectionRepository.createNewConnection(newConnectionTabl);

      /*рандомные 5 вопросов к игре
       -- 5 вопросов из таблицы Question
       --- потом делаю в таблице RandomQuestion 5 записей
       и в каждой записи одинаковые  gameId */
      const arrayRandomQuestions =
        await this.questionRepository.getRandomQuestions();

      const randRow: Question = arrayRandomQuestions[0];

      const question = await this.questionRepository.getQuestionById(
        String(randRow.id),
      );

      if (!question) return null;

      const newRandom: Random = {
        createdAt: new Date().toISOString(),
        idGameFK: gameId,
        idQuestionFK: String(randRow.id),
        game: game,
        question: question,
      };

      const randomQusetionRowId =
        await this.randomQuestionRepository.createRandomRow(newRandom);
      console.log(randomQusetionRowId);
      return randomQusetionRowId;
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
