import { IsString, IsDateString, MinLength, IsEmail } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  forename: string;

  @IsString()
  surname: string;

  @IsDateString()
  dob: Date;

  @MinLength(8)
  password: string;

  @IsEmail()
  emailAddress: string;
}
