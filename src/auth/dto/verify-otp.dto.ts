import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from 'src/common/decorators/to-lower-case.decorator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'tayaab@softwarealliance.io',
  })
  @Trim()
  @IsNotEmpty()
  @ToLowerCase()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '1234',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  readonly otp: string;
}
