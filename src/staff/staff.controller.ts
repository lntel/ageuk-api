import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';
import { Permission } from '../common/decorators/permission.decorator';
import { SkipPermissions } from '../common/decorators/skipPermission.decorator';
import { PermissionTypeEnum } from '../roles/types/Permissions';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { fileInterceptor } from './interceptors/file.interceptor';
import { StaffService } from './staff.service';

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

  @SkipPermissions()
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
  
  @SkipPermissions()
  @Delete('/avatar')
  removeAvatar(@GetCurrentUser() user, @Param('id') id: string) {
    return this.staffService.removeAvatar(user);
  }

  @Delete(':id')
  remove(@GetCurrentUser() user, @Param('id') id: string) {
    return this.staffService.remove(user, +id);
  }

  // https://docs.nestjs.com/techniques/file-upload
  @SkipPermissions()
  @UseInterceptors(fileInterceptor)
  @Post('/avatar/upload')
  uploadFile(@GetCurrentUser() user, @UploadedFile() file: Express.Multer.File) {
    return this.staffService.uploadAvatar(user, file);
  }

}
