import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Status } from 'src/users/enums/status.enum';
import { CreatePasswordDto } from './dto/create-password.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { SignedUser } from 'src/common/types/signed-user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(signupDto: SignupDto) {
    const isUserExists = await this.userService.findByEmail(signupDto.email);
    if (isUserExists?.password)
      throw new ConflictException('User already exists');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.mailService.sendMail({
      to: signupDto.email,
      subject: 'Verify Email OTP',
      html: this.getOtpMailTemplate(signupDto, otp, 'register'),
    });
    if (isUserExists) {
      isUserExists.otp = otp;
      isUserExists.save();
    } else await this.userService.create({ ...signupDto, otp });
    return {
      message: 'Otp sent to your email',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.userService.findByEmail(verifyOtpDto.email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.otp == verifyOtpDto.otp) {
      user.otp = undefined;
      user.status = Status.Verified;
      await user.save();
      return {
        message: 'Otp verified successfully',
      };
    } else throw new UnauthorizedException('Invalid otp');
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const isUserExists = await this.userService.findByEmail(resendOtpDto.email);
    if (!isUserExists) throw new UnauthorizedException('User not found');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.mailService.sendMail({
      to: resendOtpDto.email,
      subject: 'Verify Email OTP',
      html: this.getOtpMailTemplate(isUserExists, otp, 'register'),
    });
    isUserExists.state = Status.Pending;
    isUserExists.otp = otp;
    await isUserExists.save();
    return {
      message: 'Otp sent to your email',
    };
  }

  async createPassword(createPasswordDto: CreatePasswordDto) {
    const { email, password } = createPasswordDto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.status != Status.Verified)
      throw new UnauthorizedException('Please verify email first');
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.status = Status.Completed;
    user.save();
    return {
      message: 'Password created successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user || !user?.password)
      throw new UnauthorizedException('User not found');
    const isMatched = await bcrypt.compare(password, user.password as string);
    if (!isMatched) throw new UnauthorizedException('Invalid password');
    const { _id, role } = user;
    const token = this.jwtService.sign({
      _id,
      role,
    });
    user.state = Status.Completed;
    user.otp = undefined;
    await user.save();
    return {
      ...user.toJSON(),
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const isUserExists = await this.userService.findByEmail(
      forgotPasswordDto.email,
    );
    if (!isUserExists) throw new UnauthorizedException('User not found');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.mailService.sendMail({
      to: forgotPasswordDto.email,
      subject: 'Verify Email OTP',
      html: this.getOtpMailTemplate(isUserExists, otp, 'forgot-password'),
    });
    isUserExists.state = Status.Pending;
    isUserExists.otp = otp;
    await isUserExists.save();
    return {
      message: 'Otp sent to your email',
    };
  }

  async deleteAccount(signedUser: SignedUser) {
    const user = this.userService.findById(signedUser._id);
    if (!user) throw new UnauthorizedException('User not found');
    await user.deleteOne();
    return {
      message: 'User deleted successfully',
    };
  }

  getOtpMailTemplate(user: any, otp: string, from: string) {
    return `<!DOCTYPE html>
            <html lang="en" style="margin:0;padding:0;">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>OTP Verification</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:sans-serif;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
                <tr>
                    <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                        <tr>
                        <td style="background-color:#4A90E2;padding:20px;text-align:center;color:#ffffff;">
                            <h2 style="margin:0;">Verify Email OTP</h2>
                        </td>
                        </tr>
                        <tr>
                        <td style="padding:30px;text-align:left;color:#333333;">
                            <p style="margin-top:0;">Hi ${user.first_name},</p>
                            ${
                              from == 'forgot-password'
                                ? '<p>You requested to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your account password:</p>'
                                : '<p>You requested to register your account. Please use the following One-Time Password (OTP) to proceed:</p>'
                            }
                            <div style="margin:20px 0;text-align:center;">
                            <span style="font-size:24px;font-weight:bold;letter-spacing:4px;background-color:#f0f0f0;padding:12px 24px;border-radius:6px;display:inline-block;">
                            ${otp}
                            </span>
                            </div>
                            <p>If you did not request this, you can ignore this email.</p>
                            <p style="margin-bottom:0;">Thanks,<br />The Support Team</p>
                        </td>
                        </tr>
                        <tr>
                        <td style="background-color:#f0f0f0;text-align:center;padding:15px;font-size:12px;color:#999;">
                            © ${new Date().getFullYear()} Moni. All rights reserved.
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>
            `;
  }
}
