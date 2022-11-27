import { IsString, IsDateString, MinLength, IsEmail, IsDefined, IsInt, IsEnum, IsPhoneNumber, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsString()
  @IsPhoneNumber('GB', {
    message: 'The work phone number you entered is invalid'
  })
  workPhone: string;

  @IsString()
  @IsPhoneNumber('GB', {
    message: 'The personal phone number you entered is invalid'
  })
  personalPhone: string;

}
