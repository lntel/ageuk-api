import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';
import { Permission } from '../common/decorators/permission.decorator';
import { PermissionTypeEnum } from '../roles/types/Permissions';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import { GpService } from './gp.service';

@Permission(PermissionTypeEnum.MANAGE_STAFF)
@Controller('gp')
export class GpController {
  constructor(private readonly gpService: GpService) {}
  
  @Post()
  create(@GetCurrentUser() staff, @Body(new ValidationPipe()) createGpDto: CreateGpDto) {
    return this.gpService.create(staff, createGpDto);
  }
  
  @Get()
  findAll() {
    return this.gpService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gpService.findOne(+id);
  }
  
  @Patch(':id')
  update(@GetCurrentUser() staff, @Param('id') id: string, @Body() updateGpDto: UpdateGpDto) {
    return this.gpService.update(staff, +id, updateGpDto);
  }

  @Delete(':id')
  remove(@GetCurrentUser() staff, @Param('id') id: string) {
    return this.gpService.remove(staff, +id);
  }
}
