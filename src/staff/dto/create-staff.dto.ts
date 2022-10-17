import { IsString, IsDateString, MinLength, IsEmail, IsDefined, IsInt, IsEnum } from 'class-validator';

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

  @IsDefined({
    message: 'You must select a role for the staff member'
  })
  @IsInt()
  roleId: number;

}
