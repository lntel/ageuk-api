import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsMilitaryTime, IsNumber, IsOptional, Matches } from 'class-validator';
import { CreateCallDto } from './create-call.dto';

// ! Downside is that the date cannot be updated, the staff must delete the record to change the date

export class UpdateCallDto extends PartialType(CreateCallDto) {
    @IsOptional()
    @IsMilitaryTime()
    time: string;

    @IsOptional()
    @Matches(new RegExp(/^[0-9]{10}$/), {
        message: 'You have enter an invalid NHS number',
    })
    patientId: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    staff: number[];

    @IsOptional()
    @IsDate()
    startTime: Date;

    @IsOptional()
    @IsDate()
    endTime: Date;

    @IsOptional()
    @IsDate()
    startTravelTime: Date;

    @IsOptional()
    @IsDate()
    endTravelTime: Date;
}
