import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  @ApiProperty()
  to: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  text: string;
}
