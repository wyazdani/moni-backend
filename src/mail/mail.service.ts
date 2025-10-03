import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface Mail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('NODEMAILER_EMAIL'),
        pass: this.configService.get('NODEMAILER_PASSWORD'),
      },
    });
  }

  async sendMail(mail: Mail) {
    try {
      return await this.transporter.sendMail({ from: `"Moni" <${this.configService.get('NODEMAILER_EMAIL')}>`, ...mail });
    } catch (error) {
      console.log('mail send error: ', error);
      throw new InternalServerErrorException('Failed to send mail');
    }
  }
}
