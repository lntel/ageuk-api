import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationVerbEnum } from "../entities/notification.entity";

export class CreateNotificationDto {
    @IsOptional()
    @IsString({ message: 'Verb must be a string' })
    @IsEnum(NotificationVerbEnum, {
        message: 'Verb must be a valid verb'
    })
    verb?: NotificationVerbEnum;

    @IsOptional()
    @IsDefined({ message: 'Entity must be defined' })
    @IsString({ message: 'Entity should be a string' })
    entityName?: string;

    @IsOptional()
    @IsString()
    staffId?: string;

    @IsOptional()
    @IsBoolean()
    system?: boolean;

    @IsOptional()
    @IsString()
    message?: string;
}
