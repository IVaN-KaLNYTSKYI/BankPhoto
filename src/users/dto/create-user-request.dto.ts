import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
