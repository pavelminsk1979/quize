import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Answers {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public idAnswer: number;

  @Column()
  public createdAt: string;

  @Column()
  public idGame: string;

  @Column()
  public idUser: string;

  @Column()
  public idQuestion: string;

  @Column()
  public answer: string;
}
