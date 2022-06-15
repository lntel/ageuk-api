import { IsString, Matches, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleNames: string;

  @IsString()
  surname: string;

  @IsString()
  addressLine: string;

  @IsString()
  county: string;

  @Matches(
    new RegExp(
      /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/g,
    ),
    {
      message: 'This postcode is not a valid UK postcode',
    },
  )
  postcode: string;

  @IsString()
  prognosis: string;

  @IsDateString()
  startDate: Date;
}
