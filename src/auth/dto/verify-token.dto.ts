import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class verifyTokenDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  profileId: number;
}
