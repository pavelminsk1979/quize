import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usertyp } from '../../users/domains/usertyp.entity';
import { Game } from './game.entity';
import { GameStatus } from '../api/types/dto';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class ConnectionTabl {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public idConnection: number;

  @Column()
  public createdAt: string;

  @Column()
  public status: GameStatus;

  @Column()
  public idGameFK: string;

  @Column()
  public idUserFK: string;

  @ManyToOne(() => Usertyp, 'connectionTabl')
  public usertyp: Usertyp;

  @ManyToOne(() => Game, 'connectionTabl')
  public game: Game;
}

//одна игра - два(много\несколько- всего два) подключения
