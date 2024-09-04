import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from '../repositories/connection-repository';
import { ConnectionTabl } from '../domains/connection.entity';
import { GameRepository } from '../repositories/game-repository';
import { Connection, CreateGame, GameStatus, Random } from '../api/types/dto';
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

      /*создаю запись в таблице, но ничего не возвращаю
      ибо не нужно на этом этапе */
      await this.connectionRepository.createNewConnection(newConnectionTabl);

      /*рандомные 5 вопросов к игре
       -- 5 вопросов из таблицы Question
       --- потом делаю в таблице RandomQuestion 5 записей
       и в каждой записи одинаковые  gameId */
      const arrayRandomQuestions: Question[] =
        await this.questionRepository.getRandomQuestions();

      const promisesPanding = arrayRandomQuestions.map(async (el: Question) => {
        /*возму запись из таблицы Question -- она 
        нужна чтоб связь делать с таблицей RandomQuestion*/

        const question = await this.questionRepository.getQuestionById(
          String(el.id),
        );

        if (!question) return null;

        /*созданый обьект - это одна запись в таблицу RandomQuestion
                и будет 5 таких записей и у каждой записи будут
                одинаковые gameId  но разные idQuestionFK 
                ТОБИШЬ ДЛЯ ОДНОЙ ИГРЫ ПЯТЬ РАЗНЫХ ВОПРОСОВ*/

        const newRowRandomQuestion: Random = {
          createdAt: new Date().toISOString(),
          idGameFK: gameId,
          idQuestionFK: String(el.id),
          game: game,
          question: question,
        };

        const randomQusetionRowId =
          await this.randomQuestionRepository.createRandomRow(
            newRowRandomQuestion,
          );

        return randomQusetionRowId;
      });

      /*создаю записи в таблице, но ничего не возвращаю
     ибо не нужно на этом этапе */
      await Promise.all(promisesPanding);

      /* вопросы надо взять из таблицы однообразно
       - тобишь имея АЙДИшкуИГРЫ возму вопросы и отдам
       их первому игроку(БУДЕТ В ОПРЕДЕЛЕННОМ
     ПОРЯДКЕ ОНИ ОТДАНЫ)..и темже методом попользуюсь
       когда второй игрок вступит в игру
       --У ДВОИХ ИГРОКОВ ОДИНАКОВЫЙ ПОРЯДОК
       ВОПРОСОВ БУДЕТ */

      const questionForGame =
        await this.randomQuestionRepository.getQuestionsForGame(gameId);

      /*     вопросы фронтенду надо отдать в форме 
           массив  {id: string;body: string;}*/
      const viewQuestions = questionForGame.map((el) => {
        return {
          id: el.idQuestionFK,
          body: el.question.body,
        };
      });

      /* далее надо собрать ответ и отдать на фронт
      структура ответа прописана в свагере  
      типизация  - RequestFirstPlayer*/

      return {
        id: gameId,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: user.id,
            login: user.login,
          },
          score: 0,
        },
        secondPlayerProgress: null,
        questions: viewQuestions,
        status: GameStatus.PANDING,
        pairCreatedDate: '111111',
      };
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
