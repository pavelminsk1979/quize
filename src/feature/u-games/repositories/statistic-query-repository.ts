import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistic } from '../domains/statistic.entity';
import { QueryParamStatisticInputModel } from '../../../common/pipes/query-param-statistic-input-model';
import { SortDir } from '../../../common/types';

@Injectable()
export class StatisticQueryRepository {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepository: Repository<Statistic>,
  ) {}

  async getStatisticGamesWithPagination(
    queryParamStatisticInputModel: QueryParamStatisticInputModel,
  ) {
    const { sort, pageSize, pageNumber } = queryParamStatisticInputModel;

    ////////////////////////////////////////////////////////

    /*  return {
        pagesCount: 2,
        page: 1,
        pageSize: 3,
        totalCount: 5,
        items: [
          {
            gamesCount: 9,
            winsCount: 4,
            lossesCount: 4,
            drawsCount: 1,
            sumScore: 20,
            avgScores: 2.22,
            player: {
              id: 'b7954973-e85b-4147-9b51-6076a252eff0',
              login: '292lg',
            },
          },
          {
            gamesCount: 3,
            winsCount: 3,
            lossesCount: 0,
            drawsCount: 0,
            sumScore: 13,
            avgScores: 4.33,
            player: {
              id: 'b2eb7a6f-c9d2-4da1-8592-5bd93ef2971d',
              login: '296lg',
            },
          },
          {
            gamesCount: 6,
            winsCount: 3,
            lossesCount: 3,
            drawsCount: 0,
            sumScore: 13,
            avgScores: 2.17,
            player: {
              id: '10c62bd3-39d2-4ef6-9f12-993c11b84d09',
              login: '293lg',
            },
          },
        ],
      };*/

    /*{
      pagesCount: 1,
      page: 1,
      pageSize: 5,
      totalCount: 5,
      items: [
        {
          gamesCount: 9,
          winsCount: 4,
          lossesCount: 4,
          drawsCount: 1,
          sumScore: 20,
          avgScores: 2.22,
          player: {
            id: '4a464c94-311d-49aa-bbac-59d8956ff3a5',
            login: '9876lg',
          },
        },
        {
          gamesCount: 3,
          winsCount: 3,
          lossesCount: 0,
          drawsCount: 0,
          sumScore: 13,
          avgScores: 4.33,
          player: {
            id: '25f480dd-fb62-4db6-a4dc-bc6ec4b908ca',
            login: '9880lg',
          },
        },
        {
          gamesCount: 6,
          winsCount: 3,
          lossesCount: 3,
          drawsCount: 0,
          sumScore: 13,
          avgScores: 2.17,
          player: {
            id: '37f8f562-470c-4a84-a93e-8e53fe1f658a',
            login: '9877lg',
          },
        },
        {
          gamesCount: 4,
          winsCount: 1,
          lossesCount: 2,
          drawsCount: 1,
          sumScore: 9,
          avgScores: 2.25,
          player: {
            id: '59dff97c-04d3-4a1c-8c01-d037e6797c51',
            login: '9878lg',
          },
        },
        {
          gamesCount: 4,
          winsCount: 1,
          lossesCount: 3,
          drawsCount: 0,
          sumScore: 9,
          avgScores: 2.25,
          player: {
            id: '60e34333-f1d0-4be6-8720-f25a28b45710',
            login: '9879lg',
          },
        },
      ],
    };*/
    //////////////////////////////////////////////////////////

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

    const arraySort = ['avgScores desc', 'sumScore desc'];

    if (sort.length > 0) {
      arraySort.splice(0, 2, ...sort);
    }

    /*    const arrayFild: string[] = [];
    
        const arraySortDir: SortDir[] = [];
    
        for (let i = 0; i < arraySort.length; i++) {
          const element = arraySort[i];
    
          const res = element.split(' ');
    
          arrayFild.push(res[0]);
    
          let sortDir: SortDir;
          if (res[1] === 'asc') {
            sortDir = 'ASC';
          } else {
            sortDir = 'DESC';
          }
    
          arraySortDir.push(sortDir);
        }
    
        const result = await this.statisticRepository
          .createQueryBuilder('g')
          .orderBy(`g.${arrayFild[0]}`, arraySortDir[0])
          .skip(amountSkip)
          .take(pageSize)
          .getManyAndCount();
    
        return result;*/

    const queryBuilder = this.statisticRepository.createQueryBuilder('g');

    arraySort.forEach((sort) => {
      const [field, direction] = sort.split(' ');

      let sortDir: SortDir;
      if (direction === 'asc') {
        sortDir = 'ASC';
      } else {
        sortDir = 'DESC';
      }

      queryBuilder.addOrderBy(`g.${field}`, sortDir);
    });

    const result = await queryBuilder
      .skip(amountSkip)
      .take(pageSize)
      .getManyAndCount();

    const totalCount = result[1];

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    if (result[0].length === 0) {
      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: [],
      };
    }

    const viewStatistic = result[0].map((el) => {
      return {
        gamesCount: el.gamesCount,
        winsCount: el.winsCount,
        lossesCount: el.lossesCount,
        drawsCount: el.drawsCount,
        sumScore: el.sumScore,
        avgScores: Number(el.avgScores),
        player: {
          id: el.idUser,
          login: el.userLogin,
        },
      };
    });
    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: viewStatistic,
    };
  }
}
