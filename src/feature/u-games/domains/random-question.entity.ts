import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';
import { Question } from '../../u-questions/domains/question.entity';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class RandomQuestion {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public idRandom: number;

  @Column()
  public createdAt: string;

  @Column()
  public idGameFK: string;

  @Column()
  public idQuestionFK: string;

  @ManyToOne(() => Game, 'randomQuestion')
  public game: Game;

  @ManyToOne(() => Question, 'randomQuestion')
  public question: Question;
}

//одна игра -пять (много) вопросов

/*
один вопрос в таблице Question--- а в таблице RandomQuestion
 много записей с айдишкой этого вопроса (каждая
запись для разной игры )*/
