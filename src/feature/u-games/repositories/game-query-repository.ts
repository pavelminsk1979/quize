import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../domains/game.entity';
import { QueryParamsGameInputModel } from '../../../common/pipes/query-params-game-input-model';
import { SortDir } from '../../../common/types';
import { QuestionRepository } from '../../u-questions/repositories/question-repository';

@Injectable()
export class GameQueryRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    protected questionRepository: QuestionRepository,
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
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .skip(amountSkip)
      .take(pageSize)
      .getManyAndCount();

    const resAnswers = await this.gameRepository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.answers', 'a')
      .orderBy(`g.${sortBy}`, sortDir)
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .addOrderBy('a.idAnswer', 'ASC')
      .getManyAndCount();

    const resRandQuest = await this.gameRepository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.randomQuestion', 'rq')
      .orderBy(`g.${sortBy}`, sortDir)
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .addOrderBy('rq.idRandom', 'ASC')
      .getManyAndCount();

    const resArrayQuestions = await this.questionRepository.getAllQuestions();

    const arrayQuestions = resArrayQuestions.map((el) => {
      return { id: el.id, body: el.body };
      /*return { [el.id]: el.body };*/
    });

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

    const viewItems: any = [];

    for (let i = 0; i < totalCount; i++) {
      const item = result[0][i];

      const viewAnswers1: any = [];

      const viewAnswers2: any = [];

      if (resAnswers[0][i] !== undefined) {
        const answers1 = resAnswers[0][i].answers.filter(
          (el) => el.idUser === item.idPlayer1,
        );

        const answers2 = resAnswers[0][i].answers.filter(
          (el) => el.idUser === item.idPlayer2,
        );

        const viewAnsw1 = answers1.map((el) => {
          return {
            addedAt: el.createdAt,
            answerStatus: el.answerStatus,
            questionId: el.idQuestion,
          };
        });

        viewAnswers1.push(...viewAnsw1);

        const viewAnsw2 = answers2.map((el) => {
          return {
            addedAt: el.createdAt,
            answerStatus: el.answerStatus,
            questionId: el.idQuestion,
          };
        });

        viewAnswers2.push(...viewAnsw2);
      }

      const viewQustions: any = [];

      if (resRandQuest[0][i] !== undefined) {
        const viewQust = resRandQuest[0][i].randomQuestion.map((el) => {
          const idQuestion = String(el.idQuestionFK);

          const question = arrayQuestions.find(
            (el) => String(el.id) === idQuestion,
          );
          return {
            id: idQuestion,
            body: question?.body,
          };
        });

        viewQustions.push(...viewQust);
      }

      const obj = {
        id: String(item.idGame),
        firstPlayerProgress: {
          answers: viewAnswers1,
          player: {
            id: item.idPlayer1,
            login: item.loginPlayer1,
          },
          score: item.scorePlayer1,
        },
        secondPlayerProgress: {
          answers: viewAnswers2,
          player: {
            id: item.idPlayer2,
            login: item.loginPlayer2,
          },
          score: item.scorePlayer2,
        },
        questions: viewQustions,
        status: item.status,
        pairCreatedDate: item.pairCreatedDate,
        startGameDate: item.startGameDate,
        finishGameDate: item.finishGameDate,
      };

      viewItems.push(obj);
    }

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: viewItems,
    };
  }
}
