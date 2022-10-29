import { IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsDefined()
    @IsString()
    content: string;

    @IsOptional()
    @IsDefined()
    @IsNumber()
    staff: number;
}
