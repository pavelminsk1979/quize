import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Game } from '../domains/game.entity';
import { CreateGame, GameStatus } from '../api/types/dto';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async getAllGamesWithStatusActiveAndXDate() {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .where('g.status = :status AND g.xdate IS NOT NULL', {
        status: GameStatus.ACTIVE,
      })
      .getMany();
    return result;
  }

  async setXDate(
    idGame: string,
    xdate: string,
    xplayer: string,
    zplayer: string,
  ) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ xdate, xplayer, zplayer })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async getAllGames() {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .getManyAndCount();
    return result;
  }

  async getAllGamesWithCurrentUser(userId: string) {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .where('g.idPlayer1 = :userId', { userId })
      .orWhere('g.idPlayer2 = :userId', { userId })
      .getManyAndCount();
    return result;
  }

  async setStatusFinished(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ status: GameStatus.FINISHED })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    /*if (result.affected === 0) return false;
    return true;*/
  }

  async incrementScoreForPlayer1(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        scorePlayer1: () => 'scorePlayer1 + 1',
      })
      .where('idGame = :idGame', { idGame })
      .execute();
  }

  async incrementScoreForPlayer2(idGame: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        scorePlayer2: () => 'scorePlayer2 + 1',
      })
      .where('idGame = :idGame', { idGame })
      .execute();
  }

  async setStartGameDateAndIdPlayer2AndLoginPlayer2(
    idGame: string,
    idPlayer2: string,
    loginPlayer2: string,
    startGameDate: string,
    status: GameStatus,
  ) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ idPlayer2, loginPlayer2, startGameDate, status })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async setDateFinished(idGame: string, finishGameDate: string) {
    const result = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({ finishGameDate })
      .where('idGame= :idGame', { idGame })
      .execute();

    /* result это вот такая структура
   UpdateResult { generatedMaps: [], raw: [], affected: 0 }
    affected-- это количество измененных саписей
  */

    if (result.affected === 0) return false;
    return true;
  }

  async createGame(newGame: CreateGame) {
    const result: InsertResult = await this.gameRepository
      .createQueryBuilder()
      .insert()
      .into(Game)
      .values({
        createdAt: newGame.createdAt,
        finishGameDate: newGame.finishGameDate,
        pairCreatedDate: newGame.pairCreatedDate,
        status: newGame.status,
        startGameDate: newGame.startGameDate,
        idPlayer1: newGame.idPlayer1,
        loginPlayer1: newGame.loginPlayer1,
        idPlayer2: newGame.idPlayer2,
        loginPlayer2: newGame.loginPlayer2,
        scorePlayer1: newGame.scorePlayer1,
        scorePlayer2: newGame.scorePlayer2,
        xdate: newGame.xdate,
        xplayer: newGame.xplayer,
        zplayer: newGame.zplayer,
      })
      .execute();

    /*тут структура
       InsertResult {
         identifiers: [ { id: 3 } ],
           generatedMaps: [ { id: 3 } ],
           raw: [ { id: 3 } ]
       }*/

    return String(result.identifiers[0].idGame);
  }

  async getGameById(gameId: string) {
    const result = await this.gameRepository
      .createQueryBuilder('g')
      .where('g.idGame = :gameId', { gameId })
      .getOne();

    if (!result) return null;

    return result;
  }
}
