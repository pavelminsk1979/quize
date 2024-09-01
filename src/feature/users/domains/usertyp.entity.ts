import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Securitydevicetyp } from '../../security-device/domains/securitydevicetype.entity';
import { LikeStatusForPostTyp } from '../../like-status-for-post/domain/typ-like-status-for-post.entity';

@Entity()
/*не создает таблицы без
TypeOrmModule.forFeature([Usertyp]),
  в app.module.ts*/
export class Usertyp {
  @OneToMany(() => Securitydevicetyp, 'usertyp')
  public securitydevicetyp: Securitydevicetyp;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ collation: 'C' })
  public login: string;

  @Column()
  public passwordHash: string;

  @Column()
  public email: string;

  @Column()
  public createdAt: string;

  @Column()
  public confirmationCode: string;

  @Column()
  public isConfirmed: boolean;

  @Column()
  public expirationDate: string;

  @OneToMany(() => LikeStatusForPostTyp, 'usertyp')
  public likeStatusForPostTyp: LikeStatusForPostTyp;
}
