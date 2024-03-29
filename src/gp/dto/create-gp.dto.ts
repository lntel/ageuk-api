import {
  IsString,
  Matches,
  IsDefined,
} from 'class-validator';

export class CreateGpDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  surgeryName: string;

  @IsDefined()
  @Matches(
    new RegExp(
      /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
    ),
  )
  phoneNumber: string;
}
