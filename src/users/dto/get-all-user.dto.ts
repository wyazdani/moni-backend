import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetAllUsersDto {
    @ApiProperty({
    example: 1,
    required:false
  })
  @Type(() =>  Number)
  @IsNumber()
  @IsOptional()
  readonly page?: number;
}
