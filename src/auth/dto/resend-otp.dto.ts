import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ToLowerCase } from 'src/common/decorators/to-lower-case.decorator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'tayaab@softwarealliance.io',
  })
  @Trim()
  @IsNotEmpty()
  @ToLowerCase()
  @IsEmail()
  readonly email: string;
}
