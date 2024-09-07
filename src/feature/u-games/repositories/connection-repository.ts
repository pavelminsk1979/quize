import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { ConnectionTabl } from '../domains/connection.entity';
import { Connection, GameStatus } from '../api/types/dto';

@Injectable()
export class ConnectionRepository {
  constructor(
    @InjectRepository(ConnectionTabl)
    private readonly connectionRepository: Repository<ConnectionTabl>,
  ) {}

  async findRowByUseridAndGameId(userId: string, gameId: string) {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.idUserFK = :userId AND c.idGameFK= :gameId', {
        userId,
        gameId,
      })
      .getOne();

    /* запрос  будет возвращать либо 
  объект - запись из таблицы ConnectionTabl, либо null*/

    return result;
  }

  async updateRowBonus(idConnection: string) {
    const result = await this.connectionRepository
      .createQueryBuilder()
      .update(ConnectionTabl)
      .set({ bonus: 'ok' })
      .where('idConnection=:idConnection', { idConnection })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async getRowByIdConnection(idConnection: string) {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.idConnection = :idConnection', { idConnection })
      .getOne();

    /* запрос  будет возвращать либо 
     объект - запись из таблицы ConnectionTabl, либо null*/

    return result;
  }

  async updateRowRightAnswer(idConnection: string) {
    const result = await this.connectionRepository
      .createQueryBuilder()
      .update(ConnectionTabl)
      .set({ rightanswer: 'ok' })
      .where('idConnection=:idConnection', { idConnection })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  /*разница с методом findTwoRowForCorrectGameByGameId  у метода
  getTwoRowForCorrectGameByGameId что у второго есть сортировка
  --сортировка нужна чтоб определить дату более старую
  и это будет юзер который пару создал
  ---  первый в списке  это к паре - он игру создал
   --второй в списке -- создал пару иждет игрока еще одного */
  async getTwoRowForCorrectGameByGameId(idGame: string) {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.idGameFK = :idGame', { idGame })
      .orderBy('c.createdAt', 'DESC')
      .getMany();

    /* запрос  будет возвращать либо
     массив объектов (записей) из таблицы ConnectionTabl,
      либо если таких записей в таблице нет, то result
       будет пустым массивом [].*/

    return result;
  }

  async findRowActiveByUserId(userId: string) {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.status = :status AND c.idUserFK= :userId', {
        status: GameStatus.ACTIVE,
        userId,
      })
      .getOne();

    /* запрос  будет возвращать либо 
  объект - запись из таблицы ConnectionTabl, либо null*/

    return result;
  }

  async findRowPanding() {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.status = :status', { status: GameStatus.PANDING })
      .getOne();

    /* запрос  будет возвращать либо 
     объект - запись из таблицы ConnectionTabl, либо null*/

    return result;
  }

  async createNewConnection(newConnectionTabl: Connection) {
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

    /*тут структура
       InsertResult {
         identifiers: [ { id: 3 } ],
           generatedMaps: [ { id: 3 } ],
           raw: [ { id: 3 } ]
       }*/

    return String(result.identifiers[0].id);
  }

  async changePandingToActive(idConnection: string) {
    const result = await this.connectionRepository
      .createQueryBuilder()
      .update(ConnectionTabl)
      .set({ status: GameStatus.ACTIVE })
      .where('idConnection=:idConnection', { idConnection })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async findTwoRowForCorrectGameByGameId(idGame: string) {
    const result = await this.connectionRepository
      .createQueryBuilder('c')
      .where('c.idGameFK = :idGame', { idGame })
      .getMany();

    /* запрос  будет возвращать либо
     массив объектов (записей) из таблицы ConnectionTabl,
      либо если таких записей в таблице нет, то result
       будет пустым массивом [].*/

    return result;
  }

  async changeActiveToFinished(idGame: string) {
    const result = await this.connectionRepository
      .createQueryBuilder()
      .update(ConnectionTabl)
      .set({ status: GameStatus.FINISHED })
      .where('idGameFK=:idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }
}
