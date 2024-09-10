import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../domains/game.entity';
import { QueryParamsGameInputModel } from '../../../common/pipes/query-params-game-input-model';
import { SortDir } from '../../../common/types';

@Injectable()
export class GameQueryRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async getAllGames(
    userId: string,
    queryParamsGameInputModel: QueryParamsGameInputModel,
  ) {
    const { pageSize, pageNumber, sortDirection, sortBy } =
      queryParamsGameInputModel;

    /*   НАДО УКАЗЫВАТЬ КОЛИЧЕСТВО ПРОПУЩЕНЫХ
ЗАПИСЕЙ - чтобы получать следующие за ними


pageNumber по умолчанию 1, тобишь
мне надо первую страницу на фронтенд отдать
, и это будут первые 10 записей из таблицы

pageSize - размер  одной страницы, ПО УМОЛЧАНИЮ 10
ТОБИШЬ НАДО ПРОПУСКАТЬ НОЛЬ ЗАПИСЕЙ
(pageNumber - 1) * pageSize

*/

    const amountSkip = (pageNumber - 1) * pageSize;

    /*    Сортировка данных,

    .orderBy(`q.${sortBy}`, sortDir)

      sortDir это кастыль чтоб весь код не упал
      * ибо менять в енамке - и много где енамка используется
      let sortDir: SortDir;
      if (sortDirection === 'asc') {
        sortDir = 'ASC';
      } else {
        sortDir = 'DESC';
      }*/

    let sortDir: SortDir;
    if (sortDirection === 'asc') {
      sortDir = 'ASC';
    } else {
      sortDir = 'DESC';
    }

    try {
      const result = await this.gameRepository
        .createQueryBuilder('g')
        .orderBy(`g.${sortBy}`, sortDir)
        .skip(amountSkip)
        .take(pageSize)
        .getManyAndCount();
    } catch (e) {
      console.log(e);
    }

    return { userId: userId };

    /*   /!*    result    возвращает кортеж, 
   где первый элемент - массив объектов, удовлетворяющих
   запросу, а второй элемент - общее количество записей
   в базе данных, удовлетворяющих условию запроса
   без учета операции take(pageSize) -ТОБИШЬ ВСЕ ЗАПИСИ.*!/
   
       const totalCount = result[1];
   
       /!*
   pagesCount это число
   Вычисляется общее количество страниц путем деления общего
   количества записей  на размер страницы (pageSize), и 
   округление вверх с помощью функции Math.ceil.*!/
   
       const pagesCount: number = Math.ceil(totalCount / pageSize);
   
       if (result[0].length === 0) {
         return {
           pagesCount,
           page: pageNumber,
           pageSize: pageSize,
           totalCount,
           items: [],
         };
       }
   
       const viewItems = result[0];
   
       return { viewItems: viewItems };*/
  }

  /*async setDateFinished(idGame: string, finishGameDate: string) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ finishGameDate })
      .where('idGame= :idGame', { idGame })
      .execute();*/
}
