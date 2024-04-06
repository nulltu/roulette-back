import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CustomLoggerService } from '../../config/custom-logger/custom-logger.service';
import { ERROR_MESSAGES, SUCCES_MESSAGES } from '../../shared/utils/constants';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly LOGGER: CustomLoggerService) {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMailWellcome(to: string, subject: string, username: string) {
    const emailTemplate = fs.readFileSync(
      'src/modules/email-server/templates/registered-user.html',
      'utf-8',
    );

    const formattedEmail = emailTemplate
      .replace('{{username}}', username)
      .replace('{{verificationLink}}', 'link_en_curso');
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html: formattedEmail,
    };

    return await this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        this.LOGGER.error(ERROR_MESSAGES.SENT_EMAIL_ERROR, error);
      } else {
        this.LOGGER.debug(SUCCES_MESSAGES.SENT_EMAIL_SUCCESS);
      }
    });
  }
}
