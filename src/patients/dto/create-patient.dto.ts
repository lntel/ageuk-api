import { IsString, Matches, IsOptional, IsDateString, IsDefined, IsNotEmptyObject, ValidateNested, IsArray, IsInt, IsNotEmpty, IsMobilePhone, IsBoolean, isDefined, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Assessment } from '../entities/assessment.entity';

export class CreatePatientAssessmentDto {
  
  @IsDefined()
  @IsBoolean()
  dnacpr: boolean;
  
  @IsDefined()
  @IsBoolean()
  riskOfPressure: boolean;
  
  @IsDefined()
  @IsBoolean()
  reducedMobility: boolean;
  
  @IsDefined()
  @IsBoolean()
  marChart: boolean;
  
  @IsDefined()
  @IsBoolean()
  careAssistant: boolean;
  
  @IsDefined()
  @IsBoolean()
  pressureSore: boolean;
  
  @IsDefined()
  @IsBoolean()
  weightBear: boolean;
  
  @IsDefined()
  @IsBoolean()
  painSymptom: boolean;
  
  @IsDefined()
  @IsBoolean()
  medication: boolean;

  @IsDefined()
  @IsBoolean()
  syringeDriver: boolean;

  @IsOptional()
  @IsDefined()
  syringeDriverSetupDate?: Date;
}
export class CreatePatientDto {
  @IsDefined({
    message: 'You must enter an NHS number',
  })
  @Matches(new RegExp(/^[0-9]{10}$/), {
    message: 'You have enter an invalid NHS number',
  })
  id: string;

  @IsDefined({
    message: 'You must enter a first name'
  })
  @IsString()
  firstName: string;

  @IsOptional()
  @IsDefined()
  @IsString({
    message: 'You have entered an invalid middle name(s)'
  })
  middleNames: string;

  @IsDefined({
    message: 'You must enter a surname'
  })
  @IsString()
  surname: string;

  @IsDefined({
    message: 'You must enter a phone number'
  })
  @Matches(
    new RegExp(
      /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
    ),
    {
      message: 'You have entered an invalid phone number'
    }
  )
  telephoneNumber: string;

  @IsDefined({
    message: 'You must provide the patients address line'
  })
  @IsString()
  addressLine: string;

  @IsDefined({
    message: 'You must enter a DOB for the patient'
  })
  @IsDateString()
  dob: Date;

  // ? Will this be taken out? Carers say that GP's do not like one individual to be tied to it
  @IsOptional()
  @IsString()
  gpFullname: string;

  @IsDefined({
    message: 'You must enter a town or city'
  })
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

  @IsDefined({
    message: 'You must enter a postcode'
  })
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
  @IsDefined({
    message: 'You must select a prognosis'
  })
  @IsString()
  prognosis: string;

  @IsDefined({
    message: 'You must enter a date that the care provision will start'
  })
  @IsDateString()
  startDate: Date;

  @IsDefined({
    message: 'You must select a GP'
  })
  @IsInt()
  gpId: number;

  @IsDefined({
    message: 'You must enter where the referral came from'
  })
  @IsString()
  referredBy: string;

  @IsDefined({
    message: 'You must enter N.O.K details'
  })
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

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => CreatePatientAssessmentDto)
  assessment: CreatePatientAssessmentDto;

}