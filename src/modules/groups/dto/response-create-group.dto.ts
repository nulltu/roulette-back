import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../entities/group.entity';

export class ResponseCreateGroupDto extends OmitType(Group, [
  'createdAt',
  'updatedAt',
  'user',
] as const) {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'The ID of the group',
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'tuki',
    description: 'The name of the group',
  })
  groupName: string;

  @ApiProperty({
    type: 'number',
    example: 5,
    description: 'The userId of the group',
  })
  userId: number;
}
