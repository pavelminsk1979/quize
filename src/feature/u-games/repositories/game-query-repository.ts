import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../domains/game.entity';
import { QueryParamsGameInputModel } from '../../../common/pipes/query-params-game-input-model';
import { SortDir } from '../../../common/types';
import { GameStatus } from '../api/types/dto';

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

    const result = await this.gameRepository
      .createQueryBuilder('g')
      .orderBy(`g.${sortBy}`, sortDir)
      .skip(amountSkip)
      .take(pageSize)
      .getManyAndCount();

    /*    result    возвращает кортеж, 
      где первый элемент - массив объектов, удовлетворяющих
      запросу, а второй элемент - общее количество записей
      в базе данных, удовлетворяющих условию запроса
      без учета операции take(pageSize) -ТОБИШЬ ВСЕ ЗАПИСИ.*/

    const totalCount = result[1];

    /*
pagesCount это число
Вычисляется общее количество страниц путем деления общего
количества записей  на размер страницы (pageSize), и 
округление вверх с помощью функции Math.ceil.*/

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

    //const viewItems = result[0];
    const viewItems = result[0].map((el) => {
      return {
        id: el.idGame,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: el.idPlayer1,
            login: el.loginPlayer1,
          },
          score: el.scorePlayer1,
        },
        secondPlayerProgress: {
          answers: [],
          player: {
            id: el.idPlayer2,
            login: el.loginPlayer2,
          },
          score: el.scorePlayer2,
        },
        questions: 1,
        status: el.status,
        pairCreatedDate: el.pairCreatedDate,
        startGameDate: el.startGameDate,
        finishGameDate: el.finishGameDate,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: viewItems,
    };
  }
}
