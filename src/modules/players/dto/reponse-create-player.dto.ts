import { ApiProperty } from '@nestjs/swagger';

export class ResponseCreatePlayerDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'The ID of the player',
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'pepito',
    description: 'The name of the player',
  })
  name: string;

  @ApiProperty({
    type: 'number',
    example: 5,
    description: 'The groupId of the player',
  })
  groupId: number;
}
