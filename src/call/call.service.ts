import { Inject, Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PatientsService } from 'src/patients/patients.service';
import { Call } from './entities/call.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/staff/entities/staff.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CallService {

  constructor(
    @Inject(PatientsService)
    private readonly patientService: PatientsService,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async create(createCallDto: CreateCallDto) {
    const {
      time,
      patientId,
      staff
    } = createCallDto;

    // check if patient exists
    const patient = await this.patientService.findOne(String(patientId));

    const call = Call.create({
      time,
      patient,
      staff
    })
  }

  findAll() {
    return `This action returns all call`;
  }

  findOne(id: number) {
    return `This action returns a #${id} call`;
  }

  update(id: number, updateCallDto: UpdateCallDto) {
    return `This action updates a #${id} call`;
  }

  remove(id: number) {
    return `This action removes a #${id} call`;
  }
}
