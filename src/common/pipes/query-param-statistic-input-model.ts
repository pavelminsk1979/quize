import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsStringOrArray } from '../validators/string-or-array';

export class QueryParamStatisticInputModel {
  @IsStringOrArray({ message: 'sort must be a string or an array of strings' })
  @IsOptional()
  public sort: string | string[] = [];

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

/*export class QueryParamStatisticInputModel {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public sort: string[] = [];

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
}*/
