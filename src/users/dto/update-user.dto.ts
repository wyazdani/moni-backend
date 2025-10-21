import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Tayyab',
    required:false
  })
  @Trim()
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    example: 'Sheikh',
    required:false
  })
  @Trim()
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    example: 'pk',
    required:false
  })
  @Trim()
  @IsString()
  readonly country: string;

  @ApiProperty({
    example: 'Punjab',
    required:false
  })
  @Trim()
  @IsString()
  readonly state: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  readonly image: string;
}
