import { Usertyp } from '../../../users/domains/usertyp.entity';
import { Game } from '../../domains/game.entity';
import { Question } from '../../../u-questions/domains/question.entity';

export type CreateGame = {
  createdAt: string;
  isFinished: boolean;
};

export type Connection = {
  createdAt: string;
  status: string;
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

  FINISHED = 'Finished ',
}

export type RequestFirstPlayer = {
  id: 'string'; //айдишка игры
  firstPlayerProgress: FirstPlayerProgress;
  secondPlayerProgress: null;
  questions: DataQuestion[];
  status: GameStatus;
  pairCreatedDate: string; //когда создан первый игрок
};
