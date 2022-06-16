import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginStaffDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
