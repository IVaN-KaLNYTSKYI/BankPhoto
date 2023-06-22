import { IsString } from 'class-validator';

export class CreateBankRequestDto {
  @IsString()
  name: string;
}
