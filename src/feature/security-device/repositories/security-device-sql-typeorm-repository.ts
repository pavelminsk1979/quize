import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Securitydevicetyp } from '../domains/securitydevicetype.entity';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ его В ФАЙЛ app.module
 * providers: []*/
export class SecurityDeviceSqlTypeormRepository {
  constructor(
    @InjectRepository(Securitydevicetyp)
    private readonly securitydeviceRepository: Repository<Securitydevicetyp>,
  ) {}

  async createNewSecurityDevice(newDevice: Securitydevicetyp) {
    const device = new Securitydevicetyp();
    device.deviceId = newDevice.deviceId;
    device.nameDevice = newDevice.nameDevice;
    device.ip = newDevice.ip;
    device.issuedAtRefreshToken = newDevice.issuedAtRefreshToken;
    device.usertyp = newDevice.usertyp;
    const result = await this.securitydeviceRepository.save(device);
    return result;
  }

  async findDeviceByIdAndDate(deviceId: string, issuedAtRefreshToken: string) {
    const result = await this.securitydeviceRepository.findOne({
      where: { deviceId, issuedAtRefreshToken },
    });
    /*  Если сущность  с таким deviceId
     и issuedAtRefreshToken будет найдено в базе
      данных, то в result будет содержаться
       объект . Если ничего не будет найдено,
        то result будет равен undefined*/

    if (!result) return null;
    return result;
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    const result = await this.securitydeviceRepository.delete({ deviceId });

    /* если удаление не удалось, result может быть undefined 
     или содержать информацию об ошибке,*/
    if (!result) return false;
    /*Если удаление прошло успешно, result
    содержать объект DeleteResult
    --можете получить доступ к количеству удаленных
    записей так: result.affected.*/
    return true;
  }

  async findDeviceAndUserByIdAndDate(
    deviceId: string,
    issuedAtRefreshToken: string,
  ) {
    const result: Securitydevicetyp | null =
      await this.securitydeviceRepository.findOne({
        where: { deviceId, issuedAtRefreshToken },
        relations: {
          usertyp: true,
        },
      });

    /*
    ---Если запись не будет найдена (то есть result
        будет null)
        -----Если запись будет найдена вернется обьект - сущность
        ДЕВАЙС с полем  usertyp и у поля usertyp будет
         значение - это обьект user
        
        */

    if (!result) return null;
    return result;
  }

  async changeDevice(newDevice: Securitydevicetyp) {
    const result = await this.securitydeviceRepository.save(newDevice);

    /*  метод save() в TypeORM возвращает сохраненный объект,
        если операция прошла успешно, или undefined,
        если сохранение не удалось.*/

    if (!result) return false;
    return true;
  }

  async getAllDevicesCorrectUser(userId: string) {
    const result = await this.securitydeviceRepository.find({
      where: { usertyp: { id: userId } },
    });

    /* в result  будет или пустой массив
    или массив найденых обьектов*/

    return result;
  }

  async findDeviceByDeviceId(deviceId: string) {
    const result = await this.securitydeviceRepository.findOne({
      where: { deviceId },
    });
    /*  Если сущность  с таким deviceId
  будет найдено в базе
   данных, то в result будет содержаться
    объект . Если ничего не будет найдено,
     то result будет равен undefined*/

    if (!result) return null;
    return result;
  }

  async findDeviceAndUserByDeviceId(deviceId: string) {
    const result = await this.securitydeviceRepository.findOne({
      where: { deviceId },
      relations: {
        usertyp: true,
      },
    });
    /*
---Если запись не будет найдена (то есть result
    будет null)
    -----Если запись будет найдена вернется обьект - сущность
    ДЕВАЙС с полем  usertyp и у поля usertyp будет
     значение - это обьект user
    
    */

    if (!result) return null;
    return result;
  }

  async findDeviceByUserIdAndDeviceId(userId: string, deviceId: string) {
    const result = await this.securitydeviceRepository.findOne({
      where: { deviceId, usertyp: { id: userId } },
    });

    /*   ---Если запись не будет найдена (то есть result
       будет null)
       -----Если запись будет найдена вернется обьект - сущность
       ДЕВАЙС с полем  usertyp и у поля usertyp будет
       значение - это обьект user*/

    if (!result) return null;
    return result;
  }

  async deleteDevicesExeptCurrentDevice(userId: string, deviceId: string) {
    await this.securitydeviceRepository.delete({
      usertyp: { id: userId },
      deviceId: Not(deviceId),
    });
    return true;
  }
}
