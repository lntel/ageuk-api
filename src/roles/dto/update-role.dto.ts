import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PermissionTypeEnum } from '../types/Permissions';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsDefined()
    @IsEnum(PermissionTypeEnum, {
        each: true,
        message: 'A permission you have entered is invalid'
    })
    permissions: PermissionTypeEnum[];
}
