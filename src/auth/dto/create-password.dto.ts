import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ToLowerCase } from 'src/common/decorators/to-lower-case.decorator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreatePasswordDto {
  @ApiProperty({
    example: 'tayaab@softwarealliance.io',
  })
  @Trim()
  @IsNotEmpty()
  @ToLowerCase()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(40)
  readonly password: string;
}
