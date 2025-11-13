import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SignedUser } from 'src/common/types/signed-user';
import type { Request } from 'express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllUsersDto } from './dto/get-all-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll(@Query() query: GetAllUsersDto) {
    return this.usersService.findAll(query);
  }

  @ApiBearerAuth('access-token')
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.usersService.changePassword(
      changePasswordDto,
      req.user as SignedUser,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.usersService.update(
      updateUserDto,
      image,
      req.user as SignedUser,
    );
  }

  @ApiBearerAuth('access-token')
  @Delete('delete-account')
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Req() req: Request) {
    return this.usersService.deleteAccount(req.user as SignedUser);
  }
}
