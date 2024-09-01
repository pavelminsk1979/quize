import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { ViewUser } from '../api/types/views';
import { CreateUserWithId } from '../api/types/dto';
import { Usertyp } from '../domains/usertyp.entity';

@Injectable()
export class UserQuerySqlRepository {
  constructor(
    @InjectRepository(Usertyp)
    private readonly usertypRepository: Repository<Usertyp>,
  ) {}

  async getUsers(queryParams: QueryParamsInputModel) {
    const {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    } = queryParams;

    /*   НАДО УКАЗЫВАТЬ КОЛИЧЕСТВО ПРОПУЩЕНЫХ 
ЗАПИСЕЙ - чтобы получать следующие за ними

 ЗНАЧЕНИЯ ПО УМОЛЧАНИЯ В ФАЙЛЕ
 query-params-input-model.ts

pageNumber по умолчанию 1, тобишь 
мне надо первую страницу на фронтенд отдать
, и это будут первые 10 записей из таблицы

pageSize - размер  одной страницы, ПО УМОЛЧАНИЮ 10
ТОБИШЬ НАДО ПРОПУСКАТЬ НОЛЬ ЗАПИСЕЙ
(pageNumber - 1) * pageSize
*/

    const amountSkip = (pageNumber - 1) * pageSize;

    const result = await this.usertypRepository.find({
      where: [
        { login: ILike(`%${searchLoginTerm}%`) },
        { email: ILike(`%${searchEmailTerm}%`) },
      ],
      order: { [sortBy]: sortDirection }, //COLLATE "C"

      skip: amountSkip,
      take: pageSize,
    });

    const totalCount = await this.usertypRepository.count({
      where: [
        { login: ILike(`%${searchLoginTerm}%`) },
        { email: ILike(`%${searchEmailTerm}%`) },
      ],
    });

    /*
pagesCount это (число)  общее количество страниц путем деления 
общего количества документов на размер страницы (pageSize),
 и округление вверх с помощью функции Math.ceil.*/

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    const arrayUsers: ViewUser[] = result.map((user: CreateUserWithId) => {
      return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: arrayUsers,
    };
  }
}
