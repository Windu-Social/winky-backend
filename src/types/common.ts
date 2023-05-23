import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IPagination {
  @ApiProperty({ type: Number, default: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ type: Number, default: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ type: String, required: false, default: '' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export class IPaginationResponse {
  data: any;
  meta: IPaginationMeta;
}
