export type CreateGame = {
  createdAt: string;
  isFinished: boolean;
};

export type Connection = {
  createdAt: string;
  status: string;
  idGameFK: string;
  idUserFK: string;
};
