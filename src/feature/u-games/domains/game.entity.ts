import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConnectionTabl } from './connection.entity';
import { RandomQuestion } from './random-question.entity';
import { GameStatus } from '../api/types/dto';
import { Answers } from './answers.entity';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Game {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public idGame: number;

  @Column()
  public createdAt: string;

  @Column()
  public status: GameStatus;

  @Column()
  public pairCreatedDate: string;

  @Column({ type: 'text', nullable: true })
  public startGameDate: string | null;

  @Column({ type: 'text', nullable: true })
  public finishGameDate: string | null;

  @Column({ type: 'text', nullable: true })
  public idPlayer2: string | null;

  @Column({ type: 'text', nullable: true })
  public loginPlayer2: string | null;

  @Column()
  public scorePlayer1: number;

  @Column()
  public scorePlayer2: number;

  @Column()
  public idPlayer1: string;

  @Column()
  public loginPlayer1: string;

  @OneToMany(() => ConnectionTabl, 'game')
  public connectionTabl: ConnectionTabl;

  @OneToMany(() => RandomQuestion, 'game')
  public randomQuestion: RandomQuestion;

  @OneToMany(() => Answers, 'game')
  public answers: Answers;
}

//одна игра - два(много\несколько- всего два) подключения

//одна игра -пять (много) вопросов
