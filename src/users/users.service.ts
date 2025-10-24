import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignedUser } from 'src/common/types/signed-user';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  create(user: SignupDto & { otp: string }) {
    return this.userModel.create(user);
  }

  findAll() {
    return this.userModel.find();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  async update(
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
    signedUser: SignedUser,
  ) {
    const user = await this.findById(signedUser._id);
    if (!user) throw new UnauthorizedException('User not found');
    if (image) {
      const oldPublicId = user.profile_image_public_id;
      const { url, public_id } = await this.cloudinaryService.uploadFile(
        image,
        'profile-images',
      );
      user.profile_image = url;
      user.profile_image_public_id = public_id;
      oldPublicId && (await this.cloudinaryService.deleteFile(oldPublicId));
    }

    // Update user fields
    Object.assign(user, updateUserDto);
    await user.save();
    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    signedUser: SignedUser,
  ) {
    const user = await this.findById(signedUser._id);
    if (!user) throw new UnauthorizedException('User not found');
    const { old_password, new_password } = changePasswordDto;
    const isMatched = await bcrypt.compare(old_password, user.password!);
    if (!isMatched) throw new UnauthorizedException('Invalid password');
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    user.save();
    return {
      message: 'Password changed successfully',
    };
  }

  async deleteAccount(signedUser: SignedUser) {
    const user = await this.userModel.findByIdAndDelete(signedUser._id);
    if (!user) throw new UnauthorizedException('User not found');
    return {
      message: 'User deleted successfully',
    };
  }
}
