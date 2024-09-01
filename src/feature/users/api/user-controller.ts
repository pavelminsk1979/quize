import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user-service';
import { CreateUserInputModel } from './pipes/create-user-input-model';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { UserQuerySqlRepository } from '../repositories/user-query-sql-repository';

@UseGuards(AuthGuard)
@Controller('sa/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected userQuerySqlRepository: UserQuerySqlRepository,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() createUserInputModel: CreateUserInputModel) {
    const user = await this.usersService.createUser(createUserInputModel);

    if (user) {
      return user;
    } else {
      /*HTTP-код 404*/
      throw new NotFoundException('user not found:andpoint-post,url-users');
    }
  }

  @Get()
  async getUsers(@Query() queryParamsUserInputModel: QueryParamsInputModel) {
    const users = await this.userQuerySqlRepository.getUsers(
      queryParamsUserInputModel,
    );
    return users;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUserById(@Param('id') userId: string) {
    const isDeleteUserById = await this.usersService.deleteUserById(userId);
    if (isDeleteUserById) {
      return;
    } else {
      /*соответствует HTTP статус коду 404*/
      throw new NotFoundException(
        'user not found:andpoint-delete,url-users/id',
      );
    }
  }
}
