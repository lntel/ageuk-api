import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import { GP } from './entities/gp.entity';

@Injectable()
export class GpService {
  constructor(
    @InjectRepository(GP)
    private readonly gpRepository: Repository<GP>,
  ) {}
  create(createGpDto: CreateGpDto) {
    return 'This action adds a new gp';
  }

  findAll() {
    return `This action returns all gp`;
  }

  async findOne(id: number) {
    return await this.gpRepository.findOneBy({
      id,
    });
  }

  update(id: number, updateGpDto: UpdateGpDto) {
    return `This action updates a #${id} gp`;
  }

  remove(id: number) {
    return `This action removes a #${id} gp`;
  }
}
