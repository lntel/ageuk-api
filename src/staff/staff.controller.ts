import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Request, Response } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionTypeEnum } from 'src/roles/types/Permissions';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';

@Controller('staff')
@Permission(PermissionTypeEnum.MANAGE_STAFF)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
  ) {}

  @Post()
  create(@Body(new ValidationPipe()) createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }

}
