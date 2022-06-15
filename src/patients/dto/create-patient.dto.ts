import { IsString, Matches, IsOptional, IsDateString, IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class ReferralDto {
  @IsDefined()
  @IsDateString()
  date: Date;

  @IsString()
  firstName: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  organisation: string;
}
export class CreatePatientDto {
  @IsDefined({
    message: 'You must enter an NHS number',
  })
  @Matches(new RegExp(/^[0-9]{10}$/), {
    message: 'You have enter an invalid NHS number',
  })
  id: string;

  @IsDefined()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  middleNames: string;

  @IsDefined()
  @IsString()
  surname: string;

  @IsDefined()
  @IsString()
  addressLine: string;

  @IsDefined()
  @IsString()
  city: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  county: string;

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

  @IsDefined()
  @IsString()
  prognosis: string;

  @IsDefined()
  @IsDateString()
  startDate: Date;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ReferralDto)
  referral: ReferralDto;
}

