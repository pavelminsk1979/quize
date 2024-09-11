import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Game } from '../domains/game.entity';
import { CreateGame, GameStatus } from '../api/types/dto';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async getAllGamesWithCurrentUser(userId: string) {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .where('g.idPlayer1 = :userId', { userId })
      .orWhere('g.idPlayer2 = :userId', { userId })
      .getManyAndCount();
    return result;
  }

  async setStatusFinished(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ status: GameStatus.FINISHED })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    /*if (result.affected === 0) return false;
    return true;*/
  }

  async incrementScoreForPlayer1(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        scorePlayer1: () => 'scorePlayer1 + 1',
      })
      .where('idGame = :idGame', { idGame })
      .execute();
  }

  async incrementScoreForPlayer2(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        scorePlayer2: () => 'scorePlayer2 + 1',
      })
      .where('idGame = :idGame', { idGame })
      .execute();
  }

  async setStartGameDateAndIdPlayer2AndLoginPlayer2(
    idGame: string,
    idPlayer2: string,
    loginPlayer2: string,
    startGameDate: string,
    status: GameStatus,
  ) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ idPlayer2, loginPlayer2, startGameDate, status })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async setDateFinished(idGame: string, finishGameDate: string) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ finishGameDate })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async createGame(newGame: CreateGame) {
    const result: InsertResult = await this.gameRepository
      .createQueryBuilder()
      .insert()
      .into(Game)
      .values({
        createdAt: newGame.createdAt,
        finishGameDate: newGame.finishGameDate,
        pairCreatedDate: newGame.pairCreatedDate,
        status: newGame.status,
        startGameDate: newGame.startGameDate,
        idPlayer1: newGame.idPlayer1,
        loginPlayer1: newGame.loginPlayer1,
        idPlayer2: newGame.idPlayer2,
        loginPlayer2: newGame.loginPlayer2,
        scorePlayer1: newGame.scorePlayer1,
        scorePlayer2: newGame.scorePlayer2,
      })
      .execute();

    /*тут структура
       InsertResult {
         identifiers: [ { id: 3 } ],
           generatedMaps: [ { id: 3 } ],
           raw: [ { id: 3 } ]
       }*/

    return String(result.identifiers[0].idGame);
  }

  async getGameById(gameId: string) {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .where('g.idGame = :gameId', { gameId })
      .getOne();

    if (!result) return null;

    return result;
  }

  /*  async findRowPanding() {
      const result = await this.connectionRepository
        .createQueryBuilder('c')
        .where('c.status = :status', { status: 'panding' })
        .getOne();
  
      /!* запрос  будет возвращать либо 
       объект - запись из таблицы ConnectionTabl, либо null*!/
  
      return result;
    }*/

  /*  async createNewQuestion(newQuestion: CreateQuestion) {
      const result: InsertResult = await this.questionRepository
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values({
          body: newQuestion.body,
          correctAnswers: newQuestion.correctAnswers,
          createdAt: newQuestion.createdAt,
          updatedAt: newQuestion.updatedAt,
          published: newQuestion.published,
        })
        .execute();
  
      /!*тут структура
          InsertResult {
            identifiers: [ { id: 3 } ],
              generatedMaps: [ { id: 3 } ],
              raw: [ { id: 3 } ]
          }*!/
  
      return result.identifiers[0].id;
    }*/

  /*  async createNewQuestion(newQuestion: CreateQuestion) {
      const question = new Question();
      question.body = newQuestion.body;
      question.correctAnswers = newQuestion.correctAnswers;
      question.createdAt = newQuestion.createdAt;
      question.updatedAt = newQuestion.updatedAt;
      question.published = newQuestion.published;
  
      const result = await this.questionRepository.save(question);
      return result;
    }*/

  /*  async isExistQuestion(questionId: string) {
      const result = await this.questionRepository
        .createQueryBuilder('q')
        .where('q.id = :questionId', { questionId })
        .getOne();
  
      if (!result) return false;
      return true;
    }*/

  /*  async updateQuestion(
      questionId: string,
      newUpdatedAt: string,
      newBody: string,
      newCorrectAnswers: string[],
    ) {
      const result = await this.questionRepository
        .createQueryBuilder()
        .update(Question)
        .set({
          body: newBody,
          correctAnswers: newCorrectAnswers,
          updatedAt: newUpdatedAt,
        })
        .where('id=:questionId', { questionId })
        .execute();
  
      /!* result это вот такая структура 
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей 
  *!/
  
      if (result.affected === 0) return false;
  
      return true;
    }*/

  /*  async deleteQestionById(questionId: string) {
      const result = await this.questionRepository
        .createQueryBuilder()
        .delete()
        .where('id=:questionId', { questionId })
        .execute();
  
      /!*affected указывает на количество удаленных записей *!/
  
      if (result.affected === 0) return false;
      return true;
    }*/

  /*  async updateStatusPublishForQuestion(
      questionId: string,
      newPublished: boolean,
    ) {
      const result = await this.questionRepository
        .createQueryBuilder()
        .update(Question)
        .set({
          published: newPublished,
        })
        .where('id=:questionId', { questionId })
        .execute();
  
      /!* result это вот такая структура 
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей 
  *!/
  
      if (result.affected === 0) return false;
  
      return true;
    }*/

  /*  async isExistLogin(login: string) {
      const result = await this.usertypRepository.findOne({
        where: { login: login },
      });
  
      /!* в result будет или null или найденая сущность в базе в виде 
       обьекта со свойствами*!/
  
      if (!result) return null;
  
      return true;
    }*/

  /*  async isExistEmail(email: string) {
      const result = await this.usertypRepository.findOne({
        where: { email: email },
      });
  
      /!* в result будет или null или найденая сущность в базе в виде 
       обьекта со свойствами*!/
  
      if (!result) return null;
  
      return true;
    }*/

  /*  async findUserByCode(code: string) {
      const result: CreateUserWithId | null =
        await this.usertypRepository.findOne({
          where: { confirmationCode: code },
        });
  
      /!* в result будет или null или найденая сущность в базе в виде
       обьекта со свойствами*!/
  
      return result;
    }*/

  /*  async changeUser(user: CreateUserWithId) {
      const result = await this.usertypRepository.save(user);
  
      /!*  метод save() в TypeORM возвращает сохраненный объект, 
          если операция прошла успешно, или undefined, 
          если сохранение не удалось.*!/
  
      if (!result) return false;
      return true;
    }*/

  /*  async findUserByLoginOrEmail(loginOrEmail: string) {
      const result = await this.usertypRepository.find({
        where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      });
  
      /!* в переменной result будет содержаться массив
       объектов пользователей, которые удовлетворяют 
       условиям поиска по логину или почте*!/
      if (result.length === 0) return null;
      return result[0];
    }*/

  /*  async findUserByEmail(email: string) {
      const result = await this.usertypRepository.find({
        where: { email },
      });
  
      /!* в переменной result будет содержаться массив
       объектов пользователей, которые удовлетворяют 
       условиям поиска по логину или почте*!/
      if (result.length === 0) return null;
      return result[0];
    }*/

  /*  async getUserById(userId: string) {
      const result = await this.usertypRepository.find({
        where: { id: userId },
      });
  
      /!* в переменной result будет содержаться массив
   объектов пользователей, которые удовлетворяют 
   условиям поиска по логину или почте*!/
  
      if (result.length === 0) return null;
      return result[0];
    }*/
}
