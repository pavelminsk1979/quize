import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateQuestionInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500, {
    message: 'Lengt field body should be more 10 and less 500 simbols',
  })
  body: string;

  @IsArray()
  @IsNotEmpty()
  correctAnswers: string[];
}
