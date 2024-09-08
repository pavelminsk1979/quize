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
    /*если для текущего юзера нет пары
    - вернуть 404  */

    const rowWithStatusActiveFromConnectionTabl: ConnectionTabl | null =
      await this.connectionRepository.findRowActiveByUserId(userId);

    if (!rowWithStatusActiveFromConnectionTabl) {
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
      return {
        id: rowWithStatusPandingFromConnectionTabl.idGameFK,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: userId,
            login: rowUser.login,
          },
          score: 0,
        },
        pairCreatedDate: rowWithStatusPandingFromConnectionTabl.createdAt,
        questions: null,
        secondPlayerProgress: null,
        startGameDate: null,
        status: 'PendingSecondPlayer',
        finishGameDate: null,
      };
    }

    const gameId = rowWithStatusActiveFromConnectionTabl.idGameFK;

    /* получу айдишку второго игрока
     --сначала по gameId из таблицы ConnectionTabl 
     получу ПАРУ ИГРОКОВ
     --- потом найду айдишку второго */

    const twoPlayers =
      await this.connectionRepository.findTwoRowForCorrectGameByGameId(gameId);

    const twoIdUsers = twoPlayers.map((el) => el.idUserFK);

    return this.commonMethod(userId, gameId, twoIdUsers);
  }

  async getGameById(userId: string, gameId: string) {
    /* надо по АЙДИшкеИГРЫ взять ПАРУ игроков из
     таблицы ConnectionTabl*/

    const twoPlayers =
      await this.connectionRepository.findTwoRowForCorrectGameByGameId(gameId);

    const twoIdUsers = twoPlayers.map((el) => el.idUserFK);

    const isPlayCurrentUser = twoIdUsers.find((el) => el === userId);

    if (!isPlayCurrentUser) {
      throw new ForbiddenException(
        'user not play in current game...file:game-service...  method:getGameById',
      );
    }

    const game: Game | null = await this.gameRepository.getGameById(gameId);

    if (!game) {
      throw new NotFoundException(
        'game not found...file:game-service...  method:getGameById',
      );
    }

    return this.commonMethod(userId, gameId, twoIdUsers);
  }

  async commonMethod(userId: string, gameId: string, twoIdUsers: string[]) {
    const secondUserId = twoIdUsers.find((el) => el !== userId);

    if (!secondUserId) {
      const rowUser = await this.userSqlTypeormRepository.getUserById(userId);
      if (!rowUser) {
        throw new NotFoundException(
          'rowUser not found...file:game-service...  method:getGameById',
        );
      }

      const rowConnectionTabl =
        await this.connectionRepository.findRowByUseridAndGameId(
          userId,
          gameId,
        );

      if (!rowConnectionTabl) {
        throw new NotFoundException(
          'rowConnectionTabl not found...file:game-service...  method:getGameById',
        );
      }
      return {
        id: gameId,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: userId,
            login: rowUser.login,
          },
          score: 0,
        },
        pairCreatedDate: rowConnectionTabl.createdAt,
        questions: null,
        secondPlayerProgress: null,
        startGameDate: null,
        status: 'PendingSecondPlayer',
        finishGameDate: null,
      };
    }

    /*    есть две айдишки userId и secondUserId - сделаю
         для каждого игрока запрос в таблицу Answers
        и создам ответ вида     answers: [
          {
            questionId: 1,
            answerStatus: 1,
            addedAt: 1,
          },
        ],*/

    const answersFirstUser =
      await this.answerRepository.getAnswersByUserId(userId);

    const viewAnswers1 = answersFirstUser.map((el) => {
      return {
        questionId: el.idQuestion,
        answerStatus: el.answerStatus,
        addedAt: el.createdAt,
      };
    });

    const answersSecondUser =
      await this.answerRepository.getAnswersByUserId(secondUserId);

    const viewAnswers2 = answersSecondUser.map((el) => {
      return {
        questionId: el.idQuestion,
        answerStatus: el.answerStatus,
        addedAt: el.createdAt,
      };
    });

    /*найду количество баллов для обоих игроков
    также нахожу БОНУС в таблице ConnectionTabl*/

    const score1 =
      await this.answerRepository.amountCorrectAnswersFromCurrentUser(userId);

    const rowConnectionTabl1 =
      await this.connectionRepository.findRowByUseridAndGameId(userId, gameId);
    if (!rowConnectionTabl1) {
      throw new NotFoundException(
        'rowConnectionTabl not found...file:game-service...  method:getGameById',
      );
    }
    let bonus1 = 0;
    if (rowConnectionTabl1.bonus === 'ok') {
      bonus1 = 1;
    }

    const resScore1 = score1 + bonus1;

    const score2 =
      await this.answerRepository.amountCorrectAnswersFromCurrentUser(
        secondUserId,
      );

    const rowConnectionTabl2 =
      await this.connectionRepository.findRowByUseridAndGameId(
        secondUserId,
        gameId,
      );
    if (!rowConnectionTabl2) {
      throw new NotFoundException(
        'rowConnectionTabl2 not found...file:game-service...  method:getGameById',
      );
    }
    let bonus2 = 0;
    if (rowConnectionTabl2.bonus === 'ok') {
      bonus2 = 1;
    }

    const resScore2 = score2 + bonus2;

    /*   найду ЛОГИНЫ игроков из таблицы Usertyp
       чтобы создать viewPlayer -  player: {
         id: 1,
           login: 1,
       },*/
    const player1 = await this.userSqlTypeormRepository.getUserById(userId);

    if (!player1) {
      throw new NotFoundException(
        'player1 not found...file:game-service...  method:getGameById',
      );
    }

    const viewPlayer1 = { id: userId, login: player1.login };

    const player2 =
      await this.userSqlTypeormRepository.getUserById(secondUserId);

    if (!player2) {
      throw new NotFoundException(
        'player2 not found...file:game-service...  method:getGameById',
      );
    }

    const viewPlayer2 = { id: secondUserId, login: player2.login };

    /*   надо взять вопросы по ИДИГРЫ и создать структуру
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

    /*  по ГЕЙМАЙДИ в таблице  ConnectionTabl  возму значения к
     status: 1,
       pairCreatedDate: 1,
       startGameDate: 1,
       -- значение в поле createdAt для юзера который
     первым создал игру-ТОЕСТЬ ДАТА БОЛЕЕ СТАРАЯ
     это будет pairCreatedDate
     --- а когда второй вошол - ЭТО БОЛЕЕ
     СВЕЖАЯ ДАТА И ЭТО startGameDate*/

    const rowConnectionTabl =
      await this.connectionRepository.getTwoRowForCorrectGameByGameId(gameId);

    const status = rowConnectionTabl[0].status;

    /* ---  первый в списке  это к паре - он игру создал
     --второй в списке -- создал пару иждет игрока еще одного*/

    const startGameDate = rowConnectionTabl[0].createdAt;

    const pairCreatedDate = rowConnectionTabl[1].createdAt;

    /*по ГЕЙМАЙДИ  из таблицы  Game   достану запись и в ней
    finishGameDate дата  завершения игры
     */

    const rowGame = await this.gameRepository.getGameById(gameId);

    if (!rowGame) {
      throw new NotFoundException(
        'rowGame not found...file:game-service...  method:getGameById',
      );
    }

    const finishGameDate = rowGame.finishGameDate;

    /*    return {
          twoIdUsers: twoIdUsers,
          secondUserId: secondUserId,
          userId: userId,
        };*/
    return {
      id: gameId,
      firstPlayerProgress: {
        answers: viewAnswers1,

        player: viewPlayer1,
        score: resScore1,
      },
      secondPlayerProgress: {
        answers: viewAnswers2,

        player: viewPlayer2,
        score: resScore2,
      },

      questions: viewQuestions,
      status,
      pairCreatedDate,
      startGameDate,
      finishGameDate,
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

      /* вопросы надо взять из таблицы однообразно
       - тобишь имея АЙДИшкуИГРЫ возму вопросы и отдам
       их первому игроку(БУДЕТ В ОПРЕДЕЛЕННОМ
     ПОРЯДКЕ ОНИ ОТДАНЫ)..и темже методом попользуюсь
       когда второй игрок вступит в игру
       --У ДВОИХ ИГРОКОВ ОДИНАКОВЫЙ ПОРЯДОК
       ВОПРОСОВ БУДЕТ */

      const questionForGame =
        await this.randomQuestionRepository.getQuestionsForGame(gameId);

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
        id: gameId,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: userId,
            login: user.login,
          },
          score: 0,
        },
        pairCreatedDate: pairCreatedDate,
        questions: null,
        secondPlayerProgress: null,
        startGameDate: null,
        status: 'PendingSecondPlayer',
        finishGameDate: null,
      };
    }

    ////////////////////////////////////////////////
    /*  ВТОРАЯ ЧАСТЬ УСЛОВИЯ
      --- rowConnectionTabl   в таблице ConnectionTabl  запись
      со статусом   status:pandin*/
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
          id: player1.id,
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
      pairCreatedDate: player1.createdAt,
      startGameDate,
    };
  }
}
