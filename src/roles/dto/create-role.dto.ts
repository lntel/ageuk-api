import { Transform, Type } from "class-transformer";
import { IsArray, IsDefined, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { PermissionTypeEnum } from "../types/Permissions";

export class CreateRoleDto {

    @IsDefined()
    @IsNotEmpty()
    name: string;

    @IsDefined()
    @IsEnum(PermissionTypeEnum, {
        each: true,
        message: 'A permission you have entered is invalid'
    })
    permissions: PermissionTypeEnum[];

}
