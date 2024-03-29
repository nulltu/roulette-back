import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  groupName: string;

  @ApiProperty()
  userId: number;
}
