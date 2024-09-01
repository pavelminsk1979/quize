import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInputModel } from '../api/pipes/create-user-input-model';
import { HashPasswordService } from '../../../common/service/hash-password-service';
import { v4 as randomCode } from 'uuid';
import { CreateUser } from '../api/types/dto';
import { UserSqlTypeormRepository } from '../repositories/user-sql-typeorm-repository';
import { Usertyp } from '../domains/usertyp.entity';

@Injectable()
export class UsersService {
  constructor(
    protected hashPasswordService: HashPasswordService,
    protected userSqlTypeormRepository: UserSqlTypeormRepository,
  ) {}

  async createUser(createUserInputModel: CreateUserInputModel) {
    const { login, password, email } = createUserInputModel;

    /*   login и email  должны быть уникальные--поискать
       их в базе и если такие есть в базе то вернуть
       на фронт ошибку */

    const isExistLogin =
      await this.userSqlTypeormRepository.isExistLogin(login);

    if (isExistLogin) {
      throw new BadRequestException([
        {
          message: 'field login must be unique',
          field: 'login',
        },
      ]);
    }

    const isExistEmail =
      await this.userSqlTypeormRepository.isExistEmail(email);

    if (isExistEmail) {
      throw new BadRequestException([
        {
          message: 'field email must be unique',
          field: 'email',
        },
      ]);
    }

    const passwordHash = await this.hashPasswordService.generateHash(password);

    const newUser: CreateUser = {
      login,
      passwordHash,
      email,
      createdAt: new Date().toISOString(),
      confirmationCode: randomCode(),
      isConfirmed: true,
      expirationDate: new Date().toISOString(),
    };

    const result: Usertyp | null =
      await this.userSqlTypeormRepository.createNewUser(newUser);

    if (!result) return null;

    return {
      id: result.id,
      login: result.login,
      email: result.email,
      createdAt: result.createdAt,
    };
  }

  async deleteUserById(userId: string) {
    return this.userSqlTypeormRepository.deleteUserById(userId);
  }
}
