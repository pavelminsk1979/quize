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
