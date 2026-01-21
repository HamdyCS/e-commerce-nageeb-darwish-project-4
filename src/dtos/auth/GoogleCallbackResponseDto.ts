import UserDto from "./UserDto";

export default interface GoogleAuthCallbackResponseDto {
  access_token: string;
  token_type: string;
  user: UserDto;
}
