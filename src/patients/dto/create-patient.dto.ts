import { IsString, Matches, IsOptional, IsDateString, IsDefined, IsNotEmptyObject, ValidateNested, IsArray, IsInt, IsNotEmpty, IsMobilePhone, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Assessment } from '../entities/assessment.entity';

export class CreatePatientAssessmentDto {
  
  @IsDefined()
  @IsBoolean()
  hasDnacpr: boolean;
  
  @IsDefined()
  @IsBoolean()
  riskOfPressureSores: boolean;
  
  @IsDefined()
  @IsBoolean()
  reducedMobility: boolean;
  
  @IsDefined()
  @IsBoolean()
  medicationAssistant: boolean;
  
  @IsDefined()
  @IsBoolean()
  marChartInPlace: boolean;
  
  @IsDefined()
  @IsBoolean()
  personalCareAssistant: boolean;
  
  @IsDefined()
  @IsBoolean()
  pressureSores: boolean;
  
  @IsDefined()
  @IsBoolean()
  weightBearing: boolean;
  
  @IsDefined()
  @IsBoolean()
  painAndSymptomSupport: boolean;
  
  @IsDefined()
  @IsBoolean()
  medicationPresent: boolean;

  @IsDefined()
  @IsBoolean()
  syringeDriver: boolean;

  @IsOptional()
  @IsDefined()
  syringeDriverInstallationDate?: Date;
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

  @IsNotEmpty()
  @Matches(
    new RegExp(
      /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
    ),
  )
  telephoneNumber: string;

  @IsDefined()
  @IsString()
  addressLine: string;

  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @IsOptional()
  @IsString()
  gpFullname: string;

  @IsDefined()
  @IsString()
  city: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  county: string;

  @IsDefined()
  @IsArray()
  diagnoses: string[];

  @IsDefined()
  @IsArray()
  allergies: string[];

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
  @IsDefined()
  @IsString()
  prognosis: string;

  @IsDefined()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  sixWeekReview: Date;

  @IsNotEmpty()
  @IsDateString()
  eightWeekReview: Date;

  @IsDefined()
  @IsInt()
  gpId: number;

  @IsDefined()
  @IsString()
  referral: string;

  @IsDefined()
  @IsString()
  nokDetails: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  firstPointOfContact: string;

  @IsOptional()
  @IsDefined()
  @IsArray()
  additionalContacts: string[];

  @IsDefined()
  @ValidateNested()
  assessment: CreatePatientAssessmentDto;

}