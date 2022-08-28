import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionTypeEnum } from "src/roles/types/Permissions";
import { StaffService } from "src/staff/staff.service";

@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        @Inject(StaffService)
        private readonly _staffService: StaffService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const permission = this.reflector.get<PermissionTypeEnum>('permission', context.getClass());
        
        const request = context.switchToHttp().getRequest();

        const { emailAddress } = request.user;

        const user = await this._staffService.findOneBy('emailAddress', emailAddress);

        console.log(permission)

        if(!user || !user.role || user.role.permissions.indexOf(permission) < 0)
            return false;

        return true;

    }
}