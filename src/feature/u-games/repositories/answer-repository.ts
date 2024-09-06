import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { ConnectionTabl } from '../domains/connection.entity';
import { Connection, GameStatus } from '../api/types/dto';
import { Answers } from '../domains/answers.entity';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
  ) {}

  async amountAnswersFromCurrentUser(userId: string, idGame: string) {
    const result = await this.answersRepository
      .createQueryBuilder('a')
      .where('a.idUser = :userId AND a.idGame= :idGame', {
        userId,
        idGame,
      })
      .getCount();

    return result;
  }

  /*  async findRowPanding() {
      const result = await this.connectionRepository
        .createQueryBuilder('c')
        .where('c.status = :status', { status: GameStatus.PANDING })
        .getOne();
  
      /!* запрос  будет возвращать либо 
       объект - запись из таблицы ConnectionTabl, либо null*!/
  
      return result;
    }*/

  /* async createNewConnection(newConnectionTabl: Connection) {
     const result: InsertResult = await this.connectionRepository
       .createQueryBuilder()
       .insert()
       .into(ConnectionTabl)
       .values({
         createdAt: newConnectionTabl.createdAt,
         status: newConnectionTabl.status,
         idGameFK: newConnectionTabl.idGameFK,
         idUserFK: newConnectionTabl.idUserFK,
         usertyp: newConnectionTabl.usertyp,
         game: newConnectionTabl.game,
       })
       .execute();
 
     /!*тут структура
        InsertResult {
          identifiers: [ { id: 3 } ],
            generatedMaps: [ { id: 3 } ],
            raw: [ { id: 3 } ]
        }*!/
 
     return String(result.identifiers[0].id);
   }
 */
  /*
    async changePandingToActive(idConnection: string) {
      const result = await this.connectionRepository
        .createQueryBuilder()
        .update(ConnectionTabl)
        .set({ status: GameStatus.ACTIVE })
        .where('idConnection=:idConnection', { idConnection })
        .execute();
  
      /!* result это вот такая структура
     UpdateResult { generatedMaps: [], raw: [], affected: 0 }
      affected-- это количество измененных саписей
    *!/
  
      if (result.affected === 0) return false;
      return true;
    }
  */

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
