import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { SignupDto } from 'src/auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(OmitType(SignupDto,['email','where_did_hear'])) {
    @ApiProperty({
    example: 100000,
    required:false
  })
  @Type(() =>  Number)
  @IsNumber()
  @IsOptional()
  readonly income?: number;

  @ApiProperty({
    example: 950000,
    required:false
  })
  @Type(() =>  Number)
  @IsNumber()
  @IsOptional()
  readonly expense?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  readonly image?: string;

  @ApiProperty({
    example: true,
    required:false
  })
  @Type(() =>  Boolean)
  @IsBoolean()
  @IsOptional()
  readonly notification_enabled?: boolean;
}
