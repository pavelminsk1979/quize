import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { GameRepository } from '../../feature/u-games/repositories/game-repository';
import { validate as uuidValidate } from 'uuid';

@Injectable()
/*хоть его я не добавляю никуда в constructor но
ему необходимо добавлять  @Injectable()  и добавлять
его в app.module.ts в  providers: [AuthTokenGuard*/
export class ValidUUIDGuard implements CanActivate {
  constructor(protected gameRepository: GameRepository) {}

  /*canActivate определяет  разрешать ли выполнение запроса или нет
   * и возвращает булево значение*/

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Достаем параметр idИГРЫ из запроса
    const gameId = request.params.id;

    /*ЭТОТ ГАРД ЭТО КАСТЫЛЬ ИБО ПРЕДПОЛОГАЛОСЬ ЧТО
     АЙДИШКА ИГРЫ  БУДЕТ UUID   А У МЕНЯ ЧИСЛО  */

    if (uuidValidate(gameId)) {
      throw new NotFoundException('Game not found');
    }

    return true;
  }
}
