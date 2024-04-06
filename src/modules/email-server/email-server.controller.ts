import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { EmailService } from './email-server.service';
import { CreateEmailDto } from './entities/create-email.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  async sendEmailWellcome(@Body() emailData: CreateEmailDto) {
    const { to, subject, text } = emailData;
    await this.emailService.sendMailWellcome(to, subject, text);
    return { message: 'Email sent successfully' };
  }
}
