import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GpService } from 'src/gp/gp.service';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Assessment } from './entities/assessment.entity';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @Inject(forwardRef(() => GpService))
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

      const { assessment: assessmentDto } = createPatientDto;

    if(assessmentDto && assessmentDto.syringeDriver && !assessmentDto.syringeDriverSetupDate)
        throw new HttpException(
          'You must provide a syringe driver installation date',
          HttpStatus.BAD_REQUEST
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

  async findAll() {
    return await this.patientRepository.find({
      relations: ['generalPractioner', 'assessment'],
    });
  }

  async findFromGp(id: number) {
    const patients = await this.patientRepository.find({
      where: {
        generalPractioner: {
          id
        }
      }
    });

    return patients;
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

    // This is obviously as explicit as the dto

    Object.keys(updatePatientDto).map((key) => {
      patient[key] = updatePatientDto[key] || patient[key];
    });

    // patient.startDate = updatePatientDto.startDate || patient.startDate;
    // patient.firstName = updatePatientDto.firstName || patient.firstName;
    // patient.middleNames = updatePatientDto.middleNames || patient.middleNames;
    // patient.surname = updatePatientDto.surname || patient.surname;
    // patient.telephoneNumber = updatePatientDto.telephoneNumber || patient.telephoneNumber;
    // patient.addressLine = updatePatientDto.addressLine || patient.addressLine;
    // patient.dob = updatePatientDto.dob || patient.dob;
    // patient.gpFullname = updatePatientDto.gpFullname || patient.gpFullname;
    // patient.city = updatePatientDto.city || patient.city;
    // patient.county = updatePatientDto.county || patient.county;
    // patient.postcode = updatePatientDto.postcode || patient.postcode;
    // patient.sixWeekReview = updatePatientDto.sixWeekReview || patient.sixWeekReview;
    // patient.eightWeekReview = updatePatientDto.eightWeekReview || patient.eightWeekReview;
    // patient.prognosis = updatePatientDto.prognosis || patient.prognosis;
    // patient.diagnoses = updatePatientDto.diagnoses || patient.diagnoses;
    // patient.nokDetails = updatePatientDto.nokDetails || patient.nokDetails;
    // patient.firstPointOfContact = updatePatientDto.firstPointOfContact || patient.firstPointOfContact;
    // patient.additionalContacts = updatePatientDto.additionalContacts || patient.additionalContacts;

    const result = await patient.save();

    return result;
  }

  async remove(id: string) {
    const patient = await this.findOne(id);

    const result = await patient.remove();

    return result;
  }
}
