import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from 'src/common/decorators/to-lower-case.decorator';
import { Trim } from 'src/common/decorators/trim.decorator';


export class SignupDto {
  @ApiProperty({
    example: 'Tayyab',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    example: 'Sheikh',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    example: 'tayaab@softwarealliance.io',
  })
  @Trim()
  @IsNotEmpty()
  @ToLowerCase()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Pakistan',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @ApiProperty({
    example: 'Punjab',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  readonly state: string;
}
