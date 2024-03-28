import { ApiProperty } from '@nestjs/swagger';

export class LoginReponseDto {
  @ApiProperty({
    type: 'string',
    example: 'admin@admin.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTcxMTY1MDg5NiwiZXhwIjoxNzExNzM3Mjk2fQ.2Eg1uUYxJ1NuO_tSgqsITnwr0kEVl4kH8GxkO3Xshrk',
    description: 'The token of the user',
  })
  token: string;
}
