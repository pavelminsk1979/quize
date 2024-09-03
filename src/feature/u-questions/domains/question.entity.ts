import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RandomQuestion } from '../../u-games/domains/random-question.entity';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Question {
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

  @OneToMany(() => RandomQuestion, 'question')
  public randomQuestion: RandomQuestion;
}

/*
один вопрос--- во многих РАНДОМзаписях(каждая
запись для разной игры )*/
