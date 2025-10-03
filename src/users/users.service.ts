import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(user: SignupDto & { otp: string }) {
    return this.userModel.create(user);
  }

  findAll() {
    return this.userModel.find();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  update(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
