import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import { GP } from './entities/gp.entity';

@Injectable()
export class GpService {
  constructor(
    @InjectRepository(GP)
    private readonly gpRepository: Repository<GP>,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService
  ) {}
  create(createGpDto: CreateGpDto) {
    return this.gpRepository.save(createGpDto);
  }

  findAll() {
    return this.gpRepository.find({});
  }

  async findOne(id: number) {
    return await this.gpRepository.findOneBy({
      id,
    });
  }

  async update(id: number, updateGpDto: UpdateGpDto) {
    const surgery = await this.gpRepository.findOne({
      where: {
        id
      }
    });

    surgery.surgeryName = updateGpDto.surgeryName || surgery.surgeryName;
    surgery.phoneNumber = updateGpDto.phoneNumber || surgery.phoneNumber;
    surgery.address = updateGpDto.address || surgery.address;

    const result = await surgery.save();

    return result;
  }

  async remove(id: number) {
    const gp = await this.findOne(id);

    let patients = await this.patientService.findAll();

    patients = patients.filter(p => p.generalPractioner.id === id);

    if (patients.length)
      throw new HttpException(
        'Some patients within the system are still assigned to this GP, please reassign them before deleting this GP surgery',
        HttpStatus.CONFLICT,
      );

    return await gp.remove();
  }
}
