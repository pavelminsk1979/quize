import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryParamsGameInputModel {
  @IsString()
  @IsOptional()
  public sortBy = 'pairCreatedDate';

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
