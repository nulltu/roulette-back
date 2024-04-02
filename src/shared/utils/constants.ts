export const HTTP_STATUS_MESSAGES = {
  USER_DELETED_SUCCESS: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  FAILED_DELETED_USER: 'Failed to delete user',
  FAILED_FETCHING_USERS: 'Error occurred while fetching users',
  FAILED_FETCHING_GROUPS: 'Error occurred while fetching groups',
  GROUP_NOT_FOUND: 'Group not found',
  FAILED_DELETED_GROUP: 'Failed to delete group',
  GROUP_DELETED_SUCCESS: 'Group deleted successfully',
  ERROR_WHILE_CREATING_USER: 'Error occurred while creating user:',
  FAILED_DELETED_PLAYER: 'Failed to delete player',
  PLAYER_DELETED_SUCCESS: 'Player deleted successfully',
  PLAYER_NOT_FOUND: 'Player not found',
};

export interface IValidateJWT {
  id: number;
  email: string;
}
