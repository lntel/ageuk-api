import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { PermissionTypeEnum } from "src/roles/types/Permissions";
import { AccessTokenGuard } from "../guards/access-token.guard";
import { PermissionGuard } from "../guards/permission.guard";

export const Permission = (permission: PermissionTypeEnum) => {
    return applyDecorators(
        SetMetadata('permission', permission),
        UseGuards(AccessTokenGuard, PermissionGuard),
    );
}