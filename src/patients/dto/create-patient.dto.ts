import { IsString, Matches, IsOptional, IsDateString, IsDefined, IsNotEmptyObject, ValidateNested, IsArray, IsInt, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePatientDto {
  @ApiProperty()
  @IsDefined({
    message: 'You must enter an NHS number',
  })
  @Matches(new RegExp(/^[0-9]{10}$/), {
    message: 'You have enter an invalid NHS number',
  })
  id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDefined()
  @IsString()
  middleNames: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(
    new RegExp(
      /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
    ),
  )
  telephoneNumber: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  addressLine: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gpFullname: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDefined()
  @IsString()
  county: string;

  @ApiProperty()
  @IsDefined()
  @IsArray()
  diagnoses: string[];

  @ApiProperty()
  @IsDefined()
  @Matches(
    new RegExp(
      /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/,
    ),
    {
      message: 'This postcode is not a valid UK postcode',
    },
  )
  postcode: string;

  // This is usually only weeks or days
  @ApiProperty()
  @IsDefined()
  @IsString()
  prognosis: string;

  @ApiProperty()
  @IsDefined()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  sixWeekReview: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  eightWeekReview: Date;

  @ApiProperty()
  @IsDefined()
  @IsInt()
  gpId: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  referral: string;
}