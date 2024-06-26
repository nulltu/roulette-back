import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { User } from '../../modules/users/entities/user.entity';
import { Group } from '../../modules/groups/entities/group.entity';
import { ResponseCreateGroupDto } from '../../modules/groups/dto/response-create-group.dto';
import { Player } from '../../modules/players/entities/player.entity';
import { ResponsePlayerDto } from '../../modules/players/dto/response-player.dto';

export const mapUserToDto = (user: User): UserResponseDto => {
  const { id, username, email, groups } = user;
  return { id, username, email, groups };
};

export const mapGroupToDto = (group: Group): ResponseCreateGroupDto => {
  const { id, groupName, userId, players } = group;
  return { id, groupName, userId, players };
};

export const mapPlayerToDto = (player: Player): ResponsePlayerDto => {
  const { id, name, groupId } = player;
  return { id, name, groupId };
};
