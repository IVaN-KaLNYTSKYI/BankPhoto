import { IsString, IsEmail, MinLength } from 'class-validator';
export class LoginRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
