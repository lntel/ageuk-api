import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PatientsService } from '../patients/patients.service';
import { Call } from './entities/call.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from '../staff/entities/staff.entity';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CallService {

  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @Inject(PatientsService)
    private readonly patientService: PatientsService,
    @Inject(NotificationsService)
    private readonly notificationService: NotificationsService,
  ) {}

  async create(createCallDto: CreateCallDto) {
    const {
      time,
      patientId,
      date,
      staff
    } = createCallDto;

    // check if patient exists
    const patient = await this.patientService.findOne(String(patientId));

    const staffRecords = await Promise.all([
      ...staff.map(async id => {
        const record = await this.staffRepository.findOneBy({
          id
        });
  
        if(!record)
          throw new HttpException('This staff member does not exist', HttpStatus.NOT_FOUND);
  
          return record;
      })
    ]);

    staff.forEach(id => {
      this.notificationService.create({
        content: `You have a call with ${patient.firstName} ${patient.surname} at ${time} on ${new Date(date).toLocaleDateString()}`,
        staff: id
      })
    });

    const call = Call.create({
      time,
      date,
      patient,
      staff: staffRecords
    });

    return call.save();
  }

  findAll() {
    return this.callRepository.find({
      relations: ['patient', 'staff'],
      select: {
        id: true,
        date: true,
        patient: {
          id: true,
          firstName: true,
          surname: true,
          postcode: true,
        },
        staff: {
          id: true,
          forename: true,
          surname: true,
          avatarFilename: true,
        },
        time: true
      },
      order: {
        date: 'ASC'
      }
    });
  }

  async findOne(id: number) {
    const call = await this.callRepository.findOne({
      where: {
        id: String(id)
      },
      relations: ['staff', 'patient']
    });

    if(!call)
      throw new HttpException('This call was not found', HttpStatus.NOT_FOUND);

    return call;
  }

  async update(id: number, updateCallDto: UpdateCallDto) {
    const call = await this.findOne(id);
    
    if(updateCallDto.patientId) {
      // check if patient exists
      const patient = await this.patientService.findOne(String(updateCallDto.patientId));

      call.patient = patient;
    }

    if(updateCallDto.staff && updateCallDto.staff.length) {
      const staffRecords = await Promise.all([
        ...updateCallDto.staff.map(async id => {
          const record = await this.staffRepository.findOneBy({
            id
          });
    
          if(!record)
            throw new HttpException('This staff member does not exist', HttpStatus.NOT_FOUND);
    
            return record;
        })
      ]);

      // Check which staff are no longer in the call stafflist
      const diffStaff = staffRecords.filter(sr => !call.staff.find(sc => sr.id === sc.id));

      console.log(diffStaff)

      call.staff = staffRecords;
    }

    call.time = updateCallDto.time || call.time;

    call.staff.forEach(async ({ id }) => {
      await this.notificationService.create({
        content: `Your call for ${call.patient.firstName} ${call.patient.surname} on ${new Date(call.date).toLocaleDateString()} at ${call.time} has been modified`,
        staff: id
      });
    });
    
    return call.save();

  }

  async remove(id: number) {
    const call = await this.findOne(id);

    if(call.staff.length) {
      call.staff.forEach(async ({ id }) => {
        await this.notificationService.create({
          content: `Your ${call.time} call on ${new Date(call.date).toLocaleDateString()} with ${call.patient.firstName} ${call.patient.surname} has been cancelled`,
          staff: id
        })
      });
    }

    return call.remove();
  }
}
