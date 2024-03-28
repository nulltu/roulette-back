import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { User } from 'src/modules/users/entities/user.entity';

export const mapUserToDto = (user: User): UserResponseDto => {
  const { id, username, email } = user;
  return { id, username, email };
};
