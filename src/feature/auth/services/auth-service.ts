import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginInputModel } from '../api/pipes/login-input-model';
import { HashPasswordService } from '../../../common/service/hash-password-service';
import { TokenJwtService } from '../../../common/service/token-jwt-service';
import { RegistrationInputModel } from '../api/pipes/registration-input-model';
import { v4 as randomCode } from 'uuid';
import { add } from 'date-fns';
import { EmailSendService } from '../../../common/service/email-send-service';
import { RegistrationConfirmationInputModel } from '../api/pipes/registration-comfirmation-input-model';
import { NewPasswordInputModel } from '../api/pipes/new-password-input-model';
import { Request } from 'express';
import { CreateUser, CreateUserWithId } from '../../users/api/types/dto';
import { UserSqlTypeormRepository } from '../../users/repositories/user-sql-typeorm-repository';
import { Securitydevicetyp } from '../../security-device/domains/securitydevicetype.entity';
import { SecurityDeviceSqlTypeormRepository } from '../../security-device/repositories/security-device-sql-typeorm-repository';
import { Usertyp } from '../../users/domains/usertyp.entity';

@Injectable()
export class AuthService {
  constructor(
    protected hashPasswordService: HashPasswordService,
    protected tokenJwtService: TokenJwtService,
    protected emailSendService: EmailSendService,
    protected userSqlTypeormRepository: UserSqlTypeormRepository,
    protected securityDeviceSqlTypeormRepository: SecurityDeviceSqlTypeormRepository,
  ) {}

  async loginUser(loginInputModel: LoginInputModel, request: Request) {
    const { loginOrEmail, password } = loginInputModel;

    const user: Usertyp | null =
      await this.userSqlTypeormRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    if (!user.isConfirmed) return null;

    const passwordHash = user.passwordHash;

    const isCorrectPassword = await this.hashPasswordService.checkPassword(
      password,
      passwordHash,
    );

    if (!isCorrectPassword) return null;

    const userId = user.id;

    const accessToken = await this.tokenJwtService.createAccessToken(userId);

    if (!accessToken) return null;

    const deviceId = randomCode();

    const { refreshToken, issuedAtRefreshToken } =
      await this.tokenJwtService.createRefreshToken(deviceId);

    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      (request.socket.remoteAddress as string);

    const nameDevice = request.headers['user-agent'] || 'Some Device';
    const newSecurityDevice: Securitydevicetyp = {
      deviceId,
      issuedAtRefreshToken,
      ip,
      nameDevice,
      usertyp: user,
    };

    const securityDevice: Securitydevicetyp =
      await this.securityDeviceSqlTypeormRepository.createNewSecurityDevice(
        newSecurityDevice,
      );

    if (!securityDevice) return null;

    return { accessToken, refreshToken };
  }

  async registrationUser(registrationInputModel: RegistrationInputModel) {
    const { password, login, email } = registrationInputModel;

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
      isConfirmed: false,
      expirationDate: add(new Date(), { hours: 1, minutes: 2 }).toISOString(),
    };

    const result = await this.userSqlTypeormRepository.createNewUser(newUser);

    const code = newUser.confirmationCode;

    const letter: string = this.emailSendService.createLetterRegistration(code);

    try {
      await this.emailSendService.sendEmail(email, letter);
    } catch (error) {
      console.log(
        'letter was not sent to email: file auth-service.ts... method registrationUser' +
          error,
      );
    }

    return result;
  }

  async registrationConfirmation(
    registrationConfirmationInputModel: RegistrationConfirmationInputModel,
  ) {
    const { code } = registrationConfirmationInputModel;

    const user: CreateUserWithId | null =
      await this.userSqlTypeormRepository.findUserByCode(code);
    if (!user) return false;

    if (user.isConfirmed) return false;

    const expirationDate = new Date(user.expirationDate);

    const expirationDateMilSek = expirationDate.getTime();

    const currentDateMilSek = Date.now();

    if (expirationDateMilSek < currentDateMilSek) {
      return false;
    }

    user.isConfirmed = true;

    const isChangeUser: boolean =
      await this.userSqlTypeormRepository.changeUser(user);

    return isChangeUser;
  }

  async registrationEmailResending(email: string) {
    const user =
      await this.userSqlTypeormRepository.findUserByLoginOrEmail(email);
    debugger;
    if (!user) return false;

    if (user.isConfirmed) return false;

    user.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    }).toISOString();

    const newCode = randomCode();
    user.confirmationCode = newCode;

    const isChangeUser: boolean =
      await this.userSqlTypeormRepository.changeUser(user);

    if (!isChangeUser) return false;

    const letter: string =
      this.emailSendService.createLetterRegistrationResending(newCode);

    /*лучше  обработать ошибку отправки письма*/
    try {
      await this.emailSendService.sendEmail(email, letter);
    } catch (error) {
      console.log(
        'letter was not sent to email: file auth-service.ts... method registrationUser' +
          error,
      );
    }

    return isChangeUser;
  }

  async passwordRecovery(email: string) {
    const user = await this.userSqlTypeormRepository.findUserByEmail(email);

    if (!user) return false;

    const newCode = randomCode();

    const newExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    }).toISOString();

    user.confirmationCode = newCode;

    user.expirationDate = newExpirationDate;

    const isChangeUser: boolean =
      await this.userSqlTypeormRepository.changeUser(user);

    if (!isChangeUser) return false;

    const letter = this.emailSendService.createLetterRecoveryPassword(newCode);

    try {
      await this.emailSendService.sendEmail(email, letter);
    } catch (error) {
      console.log(
        'letter was not sent to email: file auth-service.ts... method passwordRecovery' +
          error,
      );
    }

    return true;
  }

  async newPassword(newPasswordInputModel: NewPasswordInputModel) {
    const { newPassword, recoveryCode } = newPasswordInputModel;
    debugger;
    const user =
      await this.userSqlTypeormRepository.findUserByCode(recoveryCode);

    if (!user) return false;

    const newPasswordHash =
      await this.hashPasswordService.generateHash(newPassword);

    user.passwordHash = newPasswordHash;

    const isChangeUser: boolean =
      await this.userSqlTypeormRepository.changeUser(user);

    if (!isChangeUser) return false;

    return true;
  }

  async updateTokensForRequestRefreshToken(refreshToken: string) {
    const result = await this.tokenJwtService.checkRefreshToken(refreshToken);

    if (!result) return null;

    const { deviceId, issuedAtRefreshToken } = result;

    const device: Securitydevicetyp | null =
      await this.securityDeviceSqlTypeormRepository.findDeviceAndUserByIdAndDate(
        deviceId,
        issuedAtRefreshToken,
      );

    if (!device) return null;

    const userId = device.usertyp.id;

    const newAccessToken = await this.tokenJwtService.createAccessToken(userId);

    const newResultRefreshToken =
      await this.tokenJwtService.createRefreshToken(deviceId);

    const newIssuedAtRefreshToken = newResultRefreshToken.issuedAtRefreshToken;

    device.issuedAtRefreshToken = newIssuedAtRefreshToken;

    const newRefreshToken = newResultRefreshToken.refreshToken;

    const isUpdateDevice: boolean =
      await this.securityDeviceSqlTypeormRepository.changeDevice(device);

    if (!isUpdateDevice) return null;

    return { newAccessToken, newRefreshToken };
  }

  async createViewModelForMeRequest(userId: string) {
    const user: Usertyp | null =
      await this.userSqlTypeormRepository.getUserById(userId);

    if (!user) return null;

    return {
      email: user.email,
      login: user.login,
      userId,
    };
  }
}
