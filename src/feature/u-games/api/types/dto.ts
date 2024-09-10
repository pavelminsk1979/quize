import { Usertyp } from '../../../users/domains/usertyp.entity';
import { Game } from '../../domains/game.entity';
import { Question } from '../../../u-questions/domains/question.entity';

export type CreateGame = {
  createdAt: string;
  finishGameDate: null;
  pairCreatedDate: string;
  status: GameStatus;
  startGameDate: null;
  idPlayer1: string;
  loginPlayer1: string;
  idPlayer2: null;
  loginPlayer2: null;
  scorePlayer1: number;
  scorePlayer2: number;
};

export type Connection = {
  createdAt: string;
  status: GameStatus;
  idGameFK: string;
  idUserFK: string;
  usertyp: Usertyp;
  game: Game;
};

export type Random = {
  createdAt: string;
  idGameFK: string;
  idQuestionFK: string;
  game: Game;
  question: Question;
};

export type FirstPlayerProgress = {
  answers: [];
  player: {
    id: string;
    login: string;
  };
  score: number;
};

export type DataQuestion = {
  id: string;
  body: string;
};

export enum GameStatus {
  PANDING = 'PendingSecondPlayer',

  ACTIVE = 'Active',

  FINISHED = 'Finished',
}

export enum AnswerStatus {
  CORRECT = 'Correct',

  INCORRECT = 'Incorrect',
}

export type RequestFirstPlayer = {
  id: 'string'; //айдишка игры
  firstPlayerProgress: FirstPlayerProgress;
  secondPlayerProgress: FirstPlayerProgress;
  questions: DataQuestion[];
  status: GameStatus;
  pairCreatedDate: string; //когда создан первый игрок
};

export type RequestFirstPlusSecondPlayer = {
  id: 'string'; //айдишка игры
  firstPlayerProgress: FirstPlayerProgress;
  secondPlayerProgress: null;
  questions: DataQuestion[];
  status: GameStatus;
  pairCreatedDate: string; //когда создан первый игрок
  startGameDate: string;
};

export type CreateAnswer = {
  createdAt: string;
  idGame: string;
  idUser: string;
  idQuestion: string;
  answer: string;
  answerStatus: AnswerStatus;
};

export type Answer = {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
};
