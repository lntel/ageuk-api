import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GpService } from 'src/gp/gp.service';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly gpService: GpService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const gp = await this.gpService.findOne(createPatientDto.gpId);

    if (!gp)
      throw new HttpException(
        'This GP surgery does not exist',
        HttpStatus.NOT_FOUND,
      );

    if (await this.isNhsNumberInUse(createPatientDto.id))
      throw new HttpException(
        'This NHS number is already in use',
        HttpStatus.CONFLICT,
      );

    const patient = this.patientRepository.create(createPatientDto);

    patient.generalPractioner = gp;

    return patient.save();
  }

  async isNhsNumberInUse(id: string) {
    return await this.patientRepository.findOneBy({
      id,
    });
  }

  findAll() {
    return this.patientRepository.find({
      relations: ['generalPractioner', 'referral'],
    });
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne({
      where: {
        id,
      },
      relations: ['generalPractioner'],
    });

    if (!patient)
      throw new HttpException(
        'This patient was not found',
        HttpStatus.NOT_FOUND,
      );

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOneBy({
      id,
    });

    if (!patient)
      throw new HttpException(
        'This patient does not exist',
        HttpStatus.NOT_FOUND,
      );

  }

  async remove(id: string) {
    const patient = await this.findOne(id);

    return this.patientRepository.remove([patient]);
  }
}
