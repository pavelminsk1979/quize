import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConnectionRepository } from '../repositories/connection-repository';
import { ConnectionTabl } from '../domains/connection.entity';
import { GameRepository } from '../repositories/game-repository';
import {
  Answer,
  AnswerStatus,
  Connection,
  CreateAnswer,
  CreateGame,
  GameStatus,
  Random,
} from '../api/types/dto';
import { QuestionRepository } from '../../u-questions/repositories/question-repository';
import { UserSqlTypeormRepository } from '../../users/repositories/user-sql-typeorm-repository';
import { Question } from '../../u-questions/domains/question.entity';
import { RandomQuestionRepository } from '../repositories/random-question-repository';
import { AnswerRepository } from '../repositories/answer-repository';
import { Game } from '../domains/game.entity';
import { Usertyp } from '../../users/domains/usertyp.entity';

@Injectable()
export class GameService {
  constructor(
    protected connectionRepository: ConnectionRepository,
    protected gameRepository: GameRepository,
    protected questionRepository: QuestionRepository,
    protected userSqlTypeormRepository: UserSqlTypeormRepository,
    protected randomQuestionRepository: RandomQuestionRepository,
    protected answerRepository: AnswerRepository,
  ) {}

  async getUnfinishedGame(userId: string) {
    /*ищу запись по айдишке со статусом 
    ЭКТИВ тоесть игра началась и пара имеется */
    const rowWithStatusActiveFromConnectionTabl: ConnectionTabl | null =
      await this.connectionRepository.findRowActiveByUserId(userId);

    if (!rowWithStatusActiveFromConnectionTabl) {
      //тут если один юзер и ожидает другого

      const rowWithStatusPandingFromConnectionTabl: ConnectionTabl | null =
        await this.connectionRepository.findRowPandingByUserId(userId);

      if (!rowWithStatusPandingFromConnectionTabl) {
        throw new NotFoundException(
          'rowWithStatusActiveFromConnectionTabl not found...file:game-service...  method:getUnfinishedGame',
        );
      }

      const rowUser = await this.userSqlTypeormRepository.getUserById(userId);

      if (!rowUser) {
        throw new NotFoundException();
      }
      return this.viewOnePlayer(
        rowWithStatusPandingFromConnectionTabl.idGameFK,
        rowUser,
        rowWithStatusPandingFromConnectionTabl.createdAt,
      );
    }

    const gameId = rowWithStatusActiveFromConnectionTabl.idGameFK;

    /*  имея АЙДИШКУИГРЫ - я имею два игрока и дальше в общем методе
      найду кто из них первый, и создам вьюМОДЕЛ для фронтенда */

    return this.commonMethod(gameId);
  }

  async getGameById(userId: string, gameId: string) {
    //есть ли такая игра

    const game: Game | null = await this.gameRepository.getGameById(gameId);

    if (!game) {
      throw new NotFoundException(
        'game not found...file:game-service...  method:getGameById',
      );
    }
    /* надо по АЙДИшкеИГРЫ взять игроков из
     таблицы ConnectionTabl   ИХ  ИЛИ ОДИН ИЛИ ДВА */

    const arrayPlayers =
      await this.connectionRepository.findTwoRowForCorrectGameByGameId(gameId);

    const arrayUsersId = arrayPlayers.map((el) => el.idUserFK);

    /*текущий юзер если не учасник этой игры
тогда вернуть 403  --он не может чужие 
игры запрашивать */

    const currentUser = arrayUsersId.find((el) => el === userId);

    if (!currentUser) {
      throw new ForbiddenException(
        'user not play in current game...file:game-service...  method:getGameById',
      );
    }
    //если один игрок в игре
    const user = await this.userSqlTypeormRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    if (arrayPlayers.length === 1) {
      return this.viewOnePlayer(gameId, user, arrayPlayers[0].createdAt);
    }

    //если   2 игрока в игре

    return this.commonMethod(gameId);
  }

  async commonMethod(gameId: string) {
    /* по gameId  достану двух юзеров которые 
     уже играют*/

    const arrayUsers =
      await this.connectionRepository.findTwoRowForCorrectGameByGameId(gameId);

    /* определить  ОСНОВЫВАЯСЬ НА ДАТЕ СОЗДАНИЯ
     кто первый создан а кто второй --ИБО ЭТО ВАЖНО
     КОГДА ОТДАЮ ВЬЮМОДЕЛЬ в ней первый игрок и вторй и
     дата создания пары(первый игрок) и дата
     начала игры(второй игрок)
     ----в таблице ConnectionTabl есть даты - их надо
      сравнить и кто больше  - тот новее-тобиш
      второй юзер 
     */

    const data1 = new Date(arrayUsers[0].createdAt);
    const data2 = new Date(arrayUsers[1].createdAt);

    let rowConnectionTab1: ConnectionTabl;
    let rowConnectionTab2: ConnectionTabl;

    if (data1 > data2) {
      rowConnectionTab2 = arrayUsers[0];
      rowConnectionTab1 = arrayUsers[1];
    } else {
      rowConnectionTab2 = arrayUsers[1];
      rowConnectionTab1 = arrayUsers[0];
    }

    /*    есть две айдишки  - сделаю
    для каждого игрока запрос в таблицу Answers
    (там ответы игроков находятся)
    и создам ВЬЮ вида     answers: [
      {
        questionId: 1,
        answerStatus: 1,
        addedAt: 1,
      },
    ],*/

    const answersUser1 =
      await this.answerRepository.getAnswersByUserIdAndByGameId(
        rowConnectionTab1.idUserFK,
        gameId,
      );

    const answersUser2 =
      await this.answerRepository.getAnswersByUserIdAndByGameId(
        rowConnectionTab2.idUserFK,
        gameId,
      );

    const game = await this.gameRepository.getGameById(gameId);

    if (!game) {
      throw new NotFoundException();
    }

    const isFinishedGame: string | null = game.finishGameDate;

    const viewAnswers1: Answer[] = [];

    const viewAnswers2: Answer[] = [];

    if (isFinishedGame) {
    }
    const answers1 = answersUser1.map((el) => {
      return {
        questionId: el.idQuestion,
        answerStatus: el.answerStatus,
        addedAt: el.createdAt,
      };
    });

    viewAnswers1.push(...answers1);

    const answers2 = answersUser2.map((el) => {
      return {
        questionId: el.idQuestion,
        answerStatus: el.answerStatus,
        addedAt: el.createdAt,
      };
    });

    viewAnswers2.push(...answers2);

    /*найду количество баллов для обоих игроков
    --- баллы ДЛЯ ТЕКУЩЕЙ ИГРЫ ПО gameId

    также нахожу БОНУС в таблице ConnectionTabl
    -если игра не завершена то бонуса нету
     по gameId  в таблице GAME поле finishGameDate:null */

    const score1 =
      await this.answerRepository.amountCorrectAnswersFromCurrentUser(
        rowConnectionTab1.idUserFK,
        gameId,
      );

    const score2 =
      await this.answerRepository.amountCorrectAnswersFromCurrentUser(
        rowConnectionTab2.idUserFK,
        gameId,
      );

    let bonus1 = 0;

    let bonus2 = 0;

    /*если игра завершена тогда надо добавить бонус*/

    if (isFinishedGame) {
      if (rowConnectionTab1.bonus === 'ok') {
        bonus1 = 1;
      }

      if (rowConnectionTab2.bonus === 'ok') {
        bonus2 = 1;
      }
    }

    const resultScore1 = score1 + bonus1;

    const resultScore2 = score2 + bonus2;

    /*   найду ЛОГИНЫ игроков из таблицы Usertyp
    чтобы создать viewPlayer -  player: {
      id: 1,
        login: 1,
    },*/
    const player1 = await this.userSqlTypeormRepository.getUserById(
      rowConnectionTab1.idUserFK,
    );

    if (!player1) {
      throw new NotFoundException(
        'player1 not found...file:game-service...  method:getGameById',
      );
    }

    const viewPlayer1 = {
      id: rowConnectionTab1.idUserFK,
      login: player1.login,
    };

    const player2 = await this.userSqlTypeormRepository.getUserById(
      rowConnectionTab2.idUserFK,
    );

    if (!player2) {
      throw new NotFoundException(
        'player2 not found...file:game-service...  method:getGameById',
      );
    }

    const viewPlayer2 = {
      id: rowConnectionTab2.idUserFK,
      login: player2.login,
    };

    /*   надо взять вопросы по aИДИГРЫ и создать структуру
    questions: [
      {id: string;body: string;},
    ],*/

    const questionForGame =
      await this.randomQuestionRepository.getQuestionsForGame(gameId);

    const viewQuestions = questionForGame.map((el) => {
      return {
        id: el.idQuestionFK,
        body: el.question.body,
      };
    });

    /*  в таблице  ConnectionTabl  возму значения к
   status: - оно одинаково у обоих игроков */

    const statusView = rowConnectionTab1.status;

    /* дата создания пары  pairCreatedDate  - это
     createdAt первого юзера   */

    const pairCreatedDateView = rowConnectionTab1.createdAt;

    /*дата старта игры  startGameDate  -  это
      createdAt  второго юзера  */

    const startGameDateView = rowConnectionTab2.createdAt;

    /*по ГЕЙМАЙДИ  из таблицы  Game   достану запись и в ней
    finishGameDate дата  завершения игры
    */

    const rowGame = await this.gameRepository.getGameById(gameId);

    if (!rowGame) {
      throw new NotFoundException();
    }

    const finishGameDateView = rowGame.finishGameDate;

    return {
      id: gameId,
      firstPlayerProgress: {
        answers: viewAnswers1,

        player: viewPlayer1,
        score: resultScore1,
      },
      secondPlayerProgress: {
        answers: viewAnswers2,

        player: viewPlayer2,
        score: resultScore2,
      },

      questions: viewQuestions,
      status: statusView,
      pairCreatedDate: pairCreatedDateView,
      startGameDate: startGameDateView,
      finishGameDate: finishGameDateView,
    };
  }

  ///////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  async setAnswer(userId: string, answer: string) {
    /*  у таблицы ConnectionTabl поискать по userId - есть ли
      запись с статусом АКТИВ--- у записи будет  АЙДИШКА игры 
      и в этойже таблице по АЙДИШКЕИГРЫ найдется второй плэйер
      ---для одной игры два плэйера в этой таблице со статусом 
      АКТИВ оба будут */

    const userActive =
      await this.connectionRepository.findRowActiveByUserId(userId);

    //если нет- 403 ошибка

    if (!userActive) return null;

    const connectionUserId1 = userActive.idConnection;

    //айдишка игры
    const idGame = userActive.idGameFK;

    const amountAnswersFromCurrentUser =
      await this.answerRepository.amountAnswersFromCurrentUser(userId, idGame);
    /*  если в таблице  ANSWERS  для данной
   userId  и  idGame имеются 5 и более записей
   тогда на все вопросы уже ответил ЮЗЕР и надо
   вернуть  403
   */

    if (amountAnswersFromCurrentUser >= 5) return null;

    /* если меньше 5-ти записей тогда в 
     таблицу  ANSWERS  добавлю запись 
     но вначале проверю- правильный ли ответ дал ЮЗЕР*/

    /*   надо найти вопрос--- вопросы выданы в определенном порядке и ответы приходят в томже порядке  -- порядок в
       таблице RandomQuestion  а  вопросы и ответы 
       в таблице Qustion*/

    /*  вопросы в определенном порядке получаю из
      таблицы RandomQuestion  по idGameFK*/

    const questionFive =
      await this.randomQuestionRepository.getQuestionsForGame(idGame);

    /* console.log('questionFivequestionFivequestionFivequestionFive');
     console.log(questionFive);
     console.log('questionFivequestionFivequestionFivequestionFive');*/

    /*  из пяти мне надо ОДИН и в той позиции(1 или 3 или 4)
    в которой у таблицы ANSWERS уже есть ответы ПЛЮС ОДИН
    (например уже одна запись есть значит на ПЕРВЫЙ ВОПРОС
  уже ответ был проверен и в таблицу добавлен
  а сейчас значит пришол ВТОРОЙ ОТВЕТ )*/

    const necessaryQuestion = questionFive[amountAnswersFromCurrentUser];

    /* necessaryQuestion - это нужная запись и в ней 
     и вопрос и ответ и я буду с этой записью сравнивать
     тот ответ что на ЭНДПОИНТ ПРИШОЛ ОТ ИГРАЮЩЕГО
     ЮЗЕРА*/

    const findResult = necessaryQuestion.question.correctAnswers.find(
      (el) => el === answer,
    );

    /*  console.log('!!!!!!!!!!!!!!!!!!!!!');
      console.log(necessaryQuestion);
      console.log('!!!!!!!!!!!!!!!!!!!!!');*/

    let answerStatus;
    if (findResult) {
      answerStatus = AnswerStatus.CORRECT;
    } else {
      answerStatus = AnswerStatus.INCORRECT;
    }

    const addedAt = new Date().toISOString();

    /*делаю  запись в таблицу ANSWER*/

    const newAnswer: CreateAnswer = {
      createdAt: addedAt,
      answer,
      idUser: userId,
      idGame,
      answerStatus,
      idQuestion: necessaryQuestion.idQuestionFK,
    };

    //запись в таблицу Answers
    await this.answerRepository.createAnswer(newAnswer);

    /*ТУТ ПРО ДОПОЛНИТЕЛЬНЫЙ БАЛЛ ДЛЯ ПЕРВОГО ОТВЕТИВШЕГО
    НА 5 ВОПРОСОВ  ЭТО ЧАСТЬ 1,   часть2 ниже далеко
     ---на каждый правильный ответ в таблице ConnectionTabl
      поле rightanswer изменяю на 'ok' даже если там уже
      есть это 'ok' но первоначально будет null
      ---когда будет 5 ответ и если rightanswer:'ok'
      и также если у другого игрока меньше 5-ти
      ответов ТОГДА В ТАБЛИЦЕ ConnectionTabl в
      поле bonus изменю на 'ok'
*/

    if (findResult) {
      await this.connectionRepository.updateRowRightAnswer(
        String(connectionUserId1),
      );
    }
    /*надо запросить количество записей в таблице
    Answers для данного юзера по idUser и если
      записей 5 ---
    --И ДАЛЕЕ  запросить количество записей
      в этойже таблице для ИГРОКА_ПАРЫ  и если
    их 5 ---тогда сменить статус АКТИВ на Finished
    и плюс  ТОГДА ДАТУ ЗАВЕРШЕНИЯ ИГРЫ УСТАНОВИТЬ*/

    const amountAnswers =
      await this.answerRepository.amountAnswersFromCurrentUser(userId, idGame);
    /*  если в таблице  ANSWERS  для данной
   userId  и  idGame имеются 5 и более записей
   тогда игра завершена ЕСЛИ У ПАРЫ ТОЖЕ 5 ЗАПИСЕЙ 
   */

    if (amountAnswers >= 5) {
      /*  надо найти  пару (две записи) для данной игры
        в таблице ConnectionTabl*/

      const twoRowForCorrectGameByGameId =
        await this.connectionRepository.findTwoRowForCorrectGameByGameId(
          idGame,
        );

      //из записи достану две айдишки

      const twoId = twoRowForCorrectGameByGameId.map((el) => el.idUserFK);

      /* оставлю одну айдишку- та которая партнера в 
       данной игре */

      const pairIdUser = twoId.filter((el) => el !== userId)[0];

      /* узнаю  количество записей
       в  таблице Answers  для ИГРОКА_ПАРЫ  */

      const amountAnswersPair =
        await this.answerRepository.amountAnswersFromCurrentUser(
          pairIdUser,
          idGame,
        );

      /*  если и у второго юзера в данной паре
         пять записей - ЗНАЧИТ ИГРА ЗАВЕРШЕНА
         и надо в таблице ConnectionTabl установить
         status  на Finished ( для обойх юзеров)
         --  и дату окончания игры поставить
         в таблице Game*/
      if (amountAnswersPair >= 5) {
        await this.connectionRepository.changeActiveToFinished(idGame);

        const dateFinishGame = new Date().toISOString();

        await this.gameRepository.setDateFinished(idGame, dateFinishGame);
      }

      /*ТУТ ПРО ДОПОЛНИТЕЛЬНЫЙ БАЛЛ ДЛЯ ПЕРВОГО ОТВЕТИВШЕГО
      НА 5 ВОПРОСОВ  ЭТО ЧАСТЬ 2,   часть1 выше  далеко
       ---на каждый правильный ответ в таблице ConnectionTabl
        поле rightanswer изменяю на 'ok' даже если там уже
        есть это 'ok' но первоначально будет null
        ---когда будет 5 ответ и если rightanswer:'ok'
        и также если у другого игрока меньше 5-ти
        ответов ТОГДА В ТАБЛИЦЕ ConnectionTabl в
        поле bonus изменю на 'ok'
  */
      if (amountAnswersPair < 5) {
        const getRowByIdConnection =
          await this.connectionRepository.getRowByIdConnection(
            String(connectionUserId1),
          );
        if (!getRowByIdConnection) {
          throw new NotFoundException(
            'getRowByIdConnection not found...file:game-service...  method:setAnswer',
          );
        }
        if (getRowByIdConnection.rightanswer === 'ok') {
          await this.connectionRepository.updateRowBonus(
            String(connectionUserId1),
          );
        }
      }
    }

    //на фронт возвращаю viewModel

    return {
      questionId: necessaryQuestion.idQuestionFK,
      answerStatus,
      addedAt,
    };
  }

  ///////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  async startGame(userId: string) {
    /*есть ли такой ЮЗЕР и дальше по коду
    понадобится запись-юзер  чтоб  связь
    между таблицами сделать*/

    const user = await this.userSqlTypeormRepository.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    /* есть ли в таблице ConnectionTabl  запись
  c пришедшей userId и  со
  статусом   status:active  --   тобишь этот пользователь
  играет в данный момент */

    const isExistPlayerWithStatusActive =
      await this.connectionRepository.findRowActiveByUserId(userId);

    if (isExistPlayerWithStatusActive) return null;

    /* есть ли в таблице ConnectionTabl  запись
     со статусом   status:panding*/

    const rowConnectionTabl: ConnectionTabl | null =
      await this.connectionRepository.findRowPanding();

    if (!rowConnectionTabl) {
      /*     если нет ожидающего игрока, - создаю ИГРУ +
             рандомные 5 вопросов к игре + создаю запись
           в таблице ConnectionTabl  с status:panding 
           */

      //создаю ИГРУ
      const newGame: CreateGame = {
        createdAt: new Date().toISOString(),
        finishGameDate: null,
      };
      const gameId: string = await this.gameRepository.createGame(newGame);

      /*надо получить запись-game чтобы создать связь
      между таблицами ConnectionTabl и Game*/

      const game = await this.gameRepository.getGameById(gameId);

      if (!game) {
        /*503 Service Unavailable
        сервер временно недоступен или перегружен*/
        throw new ServiceUnavailableException();
      }

      //дата создания новой пары
      const pairCreatedDate = new Date().toISOString();

      /*создаю запись
      в таблице ConnectionTabl  с status:panding*/
      const newConnectionTabl: Connection = {
        createdAt: pairCreatedDate,
        status: GameStatus.PANDING,
        idGameFK: gameId,
        idUserFK: userId,
        usertyp: user,
        game: game,
      };

      /*создаю запись в таблице, но ничего не возвращаю
      ибо не нужно на этом этапе */
      await this.connectionRepository.createNewConnection(newConnectionTabl);

      /*рандомные 5 вопросов к игре
       -- 5 вопросов из таблицы Question
       --- потом делаю в таблице RandomQuestion 5 записей
       и в каждой записи одинаковые  gameId */
      const arrayRandomQuestions: Question[] =
        await this.questionRepository.getRandomQuestions();

      const promisesPanding = arrayRandomQuestions.map(async (el: Question) => {
        /*возму запись из таблицы Question -- она
        нужна чтоб связь делать с таблицей RandomQuestion*/

        const question = await this.questionRepository.getQuestionById(
          String(el.id),
        );

        if (!question) {
          /*503 Service Unavailable
          сервер временно недоступен или перегружен*/
          throw new ServiceUnavailableException();
        }

        /*созданый обьект - это одна запись в таблицу RandomQuestion
                и будет 5 таких записей и у каждой записи будут
                одинаковые gameId  но разные idQuestionFK
                ТОБИШЬ ДЛЯ ОДНОЙ ИГРЫ ПЯТЬ РАЗНЫХ ВОПРОСОВ*/

        const newRowRandomQuestion: Random = {
          createdAt: new Date().toISOString(),
          idGameFK: gameId,
          idQuestionFK: String(el.id),
          game: game,
          question: question,
        };

        const randomQusetionRowId =
          await this.randomQuestionRepository.createRandomRow(
            newRowRandomQuestion,
          );

        return randomQusetionRowId;
      });

      /*создаю записи в таблице, но ничего не возвращаю
     ибо не нужно на этом этапе */
      await Promise.all(promisesPanding);

      /* далее надо собрать ответ и отдать на фронт
      структура ответа прописана в свагере
      типизация  - RequestFirstPlayer*/

      return this.viewOnePlayer(gameId, user, pairCreatedDate);
    }

    ////////////////////////////////////////////////
    /*  ВТОРАЯ ЧАСТЬ УСЛОВИЯ (один игрок есть
     со статусом пэндинг) 
     и тогда согдаю пару и начнется игра */
    //////////////////////////////////////////////

    /*  а если один игрок уже ожидал - тогда
      --- прверю может это тот же юзер и ошибка 403*/

    if (rowConnectionTabl.idUserFK === userId) return null;

    /*  а если один игрок уже ожидал - и пришедший
      сейчас это другой- тогда создам запись
      в таблице ConnectionTabl и также
     status : 'Active'
     */

    /*надо получить запись-game чтобы создать связь
      между таблицами ConnectionTabl и Game*/

    const game = await this.gameRepository.getGameById(
      rowConnectionTabl.idGameFK,
    );

    if (!game) {
      /*503 Service Unavailable
      сервер временно недоступен или перегружен*/
      throw new ServiceUnavailableException();
    }

    const startGameDate = new Date().toISOString();

    /*создаю запись для второго игрока
    в таблице ConnectionTabl  с status:ACTIVE*/
    const newPairConnectionTabl: Connection = {
      createdAt: startGameDate,
      status: GameStatus.ACTIVE,
      idGameFK: rowConnectionTabl.idGameFK,
      idUserFK: userId,
      usertyp: user,
      game: game,
    };

    /*создаю запись в таблице, но ничего не возвращаю
    ибо не нужно на этом этапе */
    await this.connectionRepository.createNewConnection(newPairConnectionTabl);

    //для пары меняю СТАТУС на АКТИВНЫЙ
    await this.connectionRepository.changePandingToActive(
      String(rowConnectionTabl.idConnection),
    );

    /*rowConnectionTabl - эта запись имеет айдишку
    юзера который в паре для данной игры
    он какбы первый юзер у которого
    статус был pending*/

    const player1 = await this.userSqlTypeormRepository.getUserById(
      rowConnectionTabl.idUserFK,
    );

    if (!player1) {
      /*503 Service Unavailable
      сервер временно недоступен или перегружен*/
      throw new ServiceUnavailableException();
    }

    /* вопросы надо взять из таблицы однообразно
  - тобишь имея АЙДИшкуИГРЫ возму вопросы
  --У ДВОИХ ИГРОКОВ ОДИНАКОВЫЙ ПОРЯДОК
  ВОПРОСОВ БУДЕТ */

    const questionForGame =
      await this.randomQuestionRepository.getQuestionsForGame(
        rowConnectionTabl.idGameFK,
      );

    /*     вопросы фронтенду надо отдать в форме
         массив  {id: string;body: string;}*/
    const viewQuestions = questionForGame.map((el) => {
      return {
        id: el.idQuestionFK,
        body: el.question.body,
      };
    });

    /* далее надо собрать ответ и отдать на фронт
    структура ответа прописана в свагере
    типизация  - RequestFirstPlayer*/

    return {
      id: rowConnectionTabl.idGameFK,
      firstPlayerProgress: {
        answers: [],
        player: {
          id: rowConnectionTabl.idUserFK,
          login: player1.login,
        },
        score: 0,
      },
      secondPlayerProgress: {
        answers: [],
        player: {
          id: user.id,
          login: user.login,
        },
        score: 0,
      },
      questions: viewQuestions,
      status: GameStatus.ACTIVE,
      pairCreatedDate: rowConnectionTabl.createdAt,
      startGameDate,
      finishGameDate: null,
    };
  }

  viewOnePlayer(gameId: string, user: Usertyp, pairCreatedDate: string) {
    return {
      id: gameId,
      firstPlayerProgress: {
        answers: [],
        player: {
          id: user.id,
          login: user.login,
        },
        score: 0,
      },
      pairCreatedDate,
      questions: null,
      secondPlayerProgress: null,
      startGameDate: null,
      status: 'PendingSecondPlayer',
      finishGameDate: null,
    };
  }
}
