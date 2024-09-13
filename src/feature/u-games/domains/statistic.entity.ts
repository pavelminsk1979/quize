import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnswerStatus } from '../api/types/dto';
import { Game } from './game.entity';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Statistic {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column()
  public idUser: string;

  @Column()
  public userLogin: string;

  @Column({ type: 'integer', default: 0 })
  public sumScore: number;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  public avgScores: number;

  @Column({ type: 'integer', default: 0 })
  public gamesCount: number;

  @Column({ type: 'integer', default: 0 })
  public winsCount: number;

  @Column({ type: 'integer', default: 0 })
  public lossesCount: number;

  @Column({ type: 'integer', default: 0 })
  public drawsCount: number;
}
