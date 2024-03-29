import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { User } from '../../modules/users/entities/user.entity';
import { Group } from '../..//modules/groups/entities/group.entity';
import { ResponseCreateGroupDto } from '../../modules/groups/dto/response-create-group.dto';

export const mapUserToDto = (user: User): UserResponseDto => {
  const { id, username, email, groups } = user;
  return { id, username, email, groups };
};

export const mapGroupToDto = (group: Group): ResponseCreateGroupDto => {
  const { id, groupName, userId } = group;
  return { id, groupName, userId };
};
