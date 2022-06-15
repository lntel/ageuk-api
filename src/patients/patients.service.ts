import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto) {
    return this.patientRepository.save(createPatientDto);
  }

  findAll() {
    return this.patientRepository.find({});
  }

  async findOne(id: number) {
    const patient = await this.patientRepository.findOne({
      where: {
        id,
      },
    });

    if (!patient)
      throw new HttpException(
        'This patient was not found',
        HttpStatus.NOT_FOUND,
      );

    return patient;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  async remove(id: number) {
    const patient = await this.findOne(id);

    return this.patientRepository.remove([patient]);
  }
}
