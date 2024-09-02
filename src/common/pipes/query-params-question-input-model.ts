import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum PublishedStatus {
  All = 'all',
  True = 'published',
  False = 'notPublished',
}

export class QueryParamsQuestionInputModel {
  @IsOptional()
  @IsString()
  public bodySearchTerm: string = '';

  @IsOptional()
  @IsEnum(PublishedStatus)
  public publishedStatus: string = PublishedStatus.All;

  @IsString()
  @IsOptional()
  public sortBy = 'createdAt';

  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = SortDirection.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  public pageSize = 10;
}

/*
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SortDirection } from '../types';
import { Transform } from 'class-transformer';

export class QueryParamsInputModel {
  /!* @IsOptional() указывает, что поле является необязательным
   и может быть опущено в запросе. Если значение для
   этого поля не будет передано в запросе, то поле
   будет иметь значение по умолчанию, которое вы 
   указали - в данном случае 'createdAt'
   -- если в запросе передан параметр sortBy, то значение
    параметра sortBy и будет использовано, и значение по умолчанию
    'createdAt' будет проигнорировано*!/

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    value.trim();
    if (value.length > 0) {
      return value.trim();
    } else {
      return 'createdAt';
    }
  })
  sortBy: string = 'createdAt';

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.DESC;

  /!* декоратор @IsNumber() в  автоматически преобразует строковое значение
   в числовое, если это возможно*!/
  @IsNumber()
  /!*  @IsInt() проверяет, что значение поля 
    является целым числом.   *!/
  @IsInt()
  /!*@Min(1) проверяет, что значение поля 
  больше или равно 1*!/
  @Min(1)
  @IsOptional()
  pageNumber = 1;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  pageSize = 10;

  @IsOptional()
  @IsString()
  searchLoginTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchEmailTerm: string | null = null;

  @IsOptional()
  @IsString()
  public searchNameTerm: string | null = null;

  /!* 
 
   public getSkipItemsCount() {
     return (this.pageNumber - 1) * this.pageSize;
   }*!/
}
*/
