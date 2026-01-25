import UserDto from "./UserDto";

export default interface LoginResponseDto {
  token: string;
  user: UserDto;
}
