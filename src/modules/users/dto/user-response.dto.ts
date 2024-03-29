import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../../modules/groups/entities/group.entity';
import { ResponseCreateGroupDto } from '../../../modules/groups/dto/response-create-group.dto';

export class UserResponseDto extends OmitType(User, [
  'password',
  'createdAt',
  'updatedAt',
  'lastLogin',
] as const) {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'The ID of the user',
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'admin',
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'example@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    type: ResponseCreateGroupDto,
    isArray: true,
    description: 'List of groups',
  })
  groups: Group[];
}
