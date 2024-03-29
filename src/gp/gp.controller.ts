import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GpService } from './gp.service';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';

@Controller('gp')
export class GpController {
  constructor(private readonly gpService: GpService) {}

  @Post()
  create(@Body() createGpDto: CreateGpDto) {
    return this.gpService.create(createGpDto);
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
  update(@Param('id') id: string, @Body() updateGpDto: UpdateGpDto) {
    return this.gpService.update(+id, updateGpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gpService.remove(+id);
  }
}
