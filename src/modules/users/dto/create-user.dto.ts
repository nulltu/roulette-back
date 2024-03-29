import { Group } from '../../../modules/groups/entities/group.entity';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  groups: Group[];
}
