import { IsArray, IsDateString, IsDefined, IsInt, IsMilitaryTime, IsNumber, Matches, isNumber } from "class-validator";

export class CreateCallDto {
    @IsDefined()
    @IsDateString()
    date: Date;

    @IsDefined()
    @IsMilitaryTime()
    time: string;

    @IsDefined()
    @Matches(new RegExp(/^[0-9]{10}$/), {
        message: 'You have enter an invalid NHS number',
    })
    patientId: number;

    @IsDefined()
    @IsNumber({}, { each: true })
    staff: number[];
}
