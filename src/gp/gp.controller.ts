import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { GpService } from './gp.service';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionTypeEnum } from 'src/roles/types/Permissions';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';

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
