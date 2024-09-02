import { Injectable } from '@nestjs/common';
import { CreateQuestion } from '../../u-questions/api/tupes/dto';
import { Question } from '../../u-questions/domains/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createNewQuestion(newQuestion: CreateQuestion) {
    const question = new Question();
    question.body = newQuestion.body;
    question.correctAnswers = newQuestion.correctAnswers;
    question.createdAt = newQuestion.createdAt;
    question.updatedAt = newQuestion.updatedAt;
    question.published = newQuestion.published;

    const result = await this.questionRepository.save(question);
    return result;
  }

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

  /*  async deleteUserById(userId: string) {
      const result = await this.usertypRepository.delete({ id: userId });
      /!* если удаление не удалось, result может быть undefined 
   или содержать информацию об ошибке,*!/
  
      if (result.affected === 0) return false;
      /!*Если удаление прошло успешно, result
      содержать объект DeleteResult
      --можете получить доступ к количеству удаленных
      записей так: result.affected.*!/
      return true;
    }*/
}
