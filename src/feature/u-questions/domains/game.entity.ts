import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Game {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column()
  public body: string;

  @Column('simple-array')
  public correctAnswers: string[];

  @Column()
  public createdAt: string;

  @Column()
  public updatedAt: string;

  @Column()
  public published: boolean;
}
