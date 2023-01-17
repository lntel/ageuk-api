import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionTypeEnum } from 'src/roles/types/Permissions';

@Controller('call')
@Permission(PermissionTypeEnum.MANAGE_STAFF)
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  create(@Body(new ValidationPipe()) createCallDto: CreateCallDto) {
    return this.callService.create(createCallDto);
  }

  @Get()
  findAll() {
    return this.callService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callService.update(+id, updateCallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callService.remove(+id);
  }
}
