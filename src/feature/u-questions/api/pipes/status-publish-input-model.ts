import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StatusPublishInputModel {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
