import { Test, TestingModule } from '@nestjs/testing';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

describe('NotificationsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatient: CreatePatientDto = {
    id: '2039405938',
    firstName: 'John',
    middleNames: 'James',
    surname: 'Doe',
    telephoneNumber: '07364 756485',
    addressLine: '64 Zoo Lane',
    dob: new Date(),
    gpFullname: 'Some Gp',
    city: 'Northampton',
    county: 'Northamptonshire',
    diagnoses: ['d1'],
    allergies: ['a1'],
    postcode: 'NN1 2DH',
    prognosis: 'Weeks',
    startDate: new Date(),
    gpId: 1,
    referredBy: 'Nurse',
    nokDetails: 'Harvey - 8278493',
    additionalContacts: ['contact 1 - 47832904'],
    firstPointOfContact: 'fpc - 5434543',
    assessment: {
      careAssistant: true,
      dnacpr: true,
      marChart: true,
      medication: true,
      painSymptom: true,
      pressureSore: true,
      reducedMobility: true,
      riskOfPressure: true,
      syringeDriver: true,
      weightBear: false,
      syringeDriverSetupDate: new Date(),
    },
  };

  beforeEach(async () => {
    // https://stackoverflow.cóom/a/64720908
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: {
            create: jest.fn((x) => x),
            findOne: jest.fn().mockResolvedValue(mockPatient),
            findAll: jest.fn().mockResolvedValue([mockPatient]),
            remove: jest.fn().mockResolvedValue(mockPatient),
            update: jest
              .fn((x) => x)
              .mockResolvedValue({
                ...mockPatient,
                surname: 'Johnson',
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const mockRecord: CreatePatientDto = {
      id: '2039405938',
      firstName: 'John',
      middleNames: 'James',
      surname: 'Doe',
      telephoneNumber: '07364 756485',
      addressLine: '64 Zoo Lane',
      dob: new Date(),
      gpFullname: 'Some Gp',
      city: 'Northampton',
      county: 'Northamptonshire',
      diagnoses: ['d1'],
      allergies: ['a1'],
      postcode: 'NN1 2DH',
      prognosis: 'Weeks',
      startDate: new Date(),
      gpId: 1,
      referredBy: 'Nurse',
      nokDetails: 'Harvey - 8278493',
      additionalContacts: ['contact 1 - 47832904'],
      firstPointOfContact: 'fpc - 5434543',
      assessment: {
        careAssistant: true,
        dnacpr: true,
        marChart: true,
        medication: true,
        painSymptom: true,
        pressureSore: true,
        reducedMobility: true,
        riskOfPressure: true,
        syringeDriver: true,
        weightBear: false,
        syringeDriverSetupDate: new Date(),
      },
    };

    it('should create a new patient', async () => {
      const result = await controller.create(mockRecord);

      expect(result).toStrictEqual(mockRecord);
    });
  });

  describe('findAll', () => {
    it('should find all patients', async () => {
      const result = await controller.findAll();

      expect(result).toStrictEqual([mockPatient]);
    });
  });

  describe('findOne', () => {
    it('should find one specific patient', async () => {
      const result = await controller.findOne('2039405938');

      expect(result).toStrictEqual(mockPatient);
    });
  });

  describe('update', () => {
    it('should update the patients surname', async () => {
      const newRecord = await controller.update('2039405938', {
        surname: 'Johnson',
      });

      expect(newRecord.surname).toStrictEqual('Johnson');
    });
  });

  describe('remove', () => {
    it('should remove the patient record', async () => {
      await controller.remove('2039405938');

      expect(service.remove).toHaveBeenCalledWith('2039405938');
    });
  });
});
