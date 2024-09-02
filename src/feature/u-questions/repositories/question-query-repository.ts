import { Injectable } from '@nestjs/common';
import { Question } from '../domains/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewModelOneQuestion } from '../api/types/views';
import { QueryParamsQuestionInputModel } from '../../../common/pipes/query-params-question-input-model';
import { SortDir } from '../../../common/types';

@Injectable()
export class QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async getQestions(
    queryParamsQuestionInputModel: QueryParamsQuestionInputModel,
  ) {
    const {
      bodySearchTerm,
      publishedStatus,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = queryParamsQuestionInputModel;

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

    /*    ----Для вывода данных порциями используется
        два оператора:
    
          .skip(amountSkip)
          .take(pageSize)
    
        -limit - для ограничения количества записей из таблицы
        которое количество я хочу в результате получить---это
        число в переменной pageSize - по умолчанию 10
    
        -offset -это сколько записей надо пропустить,
          это в переменной amountSkip   ....например если
        лимит в 10 записей и от фронтенда просят 2-ую страницу,
          значит надо пропустить (2-1)*10 =  10 записей*/

    /*    ---- из фронта передаются  символ или
        символы (bodySearchTerm) ДЛЯ СОРТИРОВКИ ПО  ПОЛЮ  body
        -- например -
        -передается от фронта "Jo"  и
        если  есть записи 
        в базе данных  и  эти ЗАПИСИ  например
        "John",
          "Johanna" и "Jonathan", тогда эти  три ЗАПИСИ будут
        выбраны и возвращены как результат запроса
        !!!НАДО ВКЛЮЧАТЬ УСЛОВИЕ О ТОМ ЧТО НЕВАЖНО БОЛЬШИЕ
        ИЛИ МАЛЕНЬКИЕ БУКВЫ ПРИХОДЯТ ОТ ФРОНТЕНДА
        -----И ДЛЯ ТАКОГО УСЛОВИЯ  ИСПОЛЬЗУЕТСЯ ключевое
        слово   ILIKE
    
        --ILIKE  это оператор
        выполнит поиск БЕЗУЧЕТА РЕГИСТРА
        */

    ////////////////////////////////////////////////////////

    /*    let status;
        if (publishedStatus === 'published') {
          status = true;
        }
        if (publishedStatus === 'notPublished') {
          status = false;
        }
        if (publishedStatus === 'all') {
          status = ????;
        }
    
        const result: [Question[], number] = await this.questionRepository
          .createQueryBuilder('q')
          .where('q.body ILIKE :bodySearchTerm', {
            bodySearchTerm: `%${bodySearchTerm}%`,
          })
          .andWhere('q.published = :status', { status })
          .orderBy(`q.${sortBy}`, sortDir)
          .skip(amountSkip)
          .take(pageSize)
          .getManyAndCount();*/

    //////////////////////////////////////////////////////

    const obj = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.body ILIKE :bodySearchTerm', {
        bodySearchTerm: `%${bodySearchTerm}%`,
      });
    if (publishedStatus === 'published') {
      obj.andWhere('q.published = :status', { status: true });
    }
    if (publishedStatus === 'notPublished') {
      obj.andWhere('q.published = :status', { status: false });
    }

    const result: [Question[], number] = await obj
      .orderBy(`q.${sortBy}`, sortDir)
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

    /*
далее перед отправкой на фронтенд 
приведу массив result[0]:Question[]  к тому виду
который ожидает  фронтенд

*/

    const viewArrayQuestions: ViewModelOneQuestion[] = result[0].map(
      (el: Question) => {
        return this.createViewModelOneQuestion(el);
      },
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: viewArrayQuestions,
    };
  }

  async getQuestionById(questionId: string) {
    const result = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.id=:questionId', { questionId })
      .getOne();

    if (!result) return false;

    const viewModel: ViewModelOneQuestion =
      this.createViewModelOneQuestion(result);

    return viewModel;
  }

  createViewModelOneQuestion(result: Question): ViewModelOneQuestion {
    return {
      id: String(result.id),
      body: result.body,
      correctAnswers: result.correctAnswers,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      published: result.published,
    };
  }
}
