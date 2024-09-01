import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 15, { message: 'Lengt field name should be less 16 simbols' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 500, {
    message: 'Lengt field description should be less 501 simbols',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 100, {
    message: 'Lengt field websiteUrl should be less 101 simbols',
  })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
