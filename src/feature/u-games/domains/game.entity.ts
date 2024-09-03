import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConnectionTabl } from './connection.entity';
import { RandomQuestion } from './random-question.entity';

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
  public isFinished: boolean;

  @OneToMany(() => ConnectionTabl, 'game')
  public connectionTabl: ConnectionTabl;

  @OneToMany(() => RandomQuestion, 'game')
  public randomQuestion: RandomQuestion;
}

//одна игра - два(много\несколько- всего два) подключения

//одна игра -пять (много) вопросов
