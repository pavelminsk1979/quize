import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AnswerInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000, {
    message: 'Lengt field content should be less 1001 simbols',
  })
  answer: string;
}
