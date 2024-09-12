import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamStatisticInputModel {
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
}
