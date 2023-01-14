import { IsArray, IsDefined, IsInt, IsMilitaryTime, IsNumber, isNumber } from "class-validator";

export class CreateCallDto {
    @IsDefined()
    @IsMilitaryTime()
    time: string;

    @IsDefined()
    @IsInt()
    patientId: number;

    @IsDefined()
    @IsNumber({}, { each: true })
    staff: number[];
}
