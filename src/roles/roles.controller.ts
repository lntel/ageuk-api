import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from '../common/decorators/permission.decorator';
import { PermissionTypeEnum } from './types/Permissions';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';

@Controller('roles')
@Permission(PermissionTypeEnum.MANAGE_STAFF)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@GetCurrentUser() staff, @Body(new ValidationPipe()) createRoleDto: CreateRoleDto) {
    return this.rolesService.create(staff, createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@GetCurrentUser() staff, @Param('id') id: string, @Body(new ValidationPipe()) updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(staff, +id, updateRoleDto);
  }

  @Delete(':id')
  remove(@GetCurrentUser() staff, @Param('id') id: string) {
    return this.rolesService.remove(staff, +id);
  }
}
