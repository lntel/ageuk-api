import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GpService } from '../gp/gp.service';
import { RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { PatientsService } from '../patients/patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Assessment } from './entities/assessment.entity';
import { Patient } from './entities/patient.entity';
import { GpModule } from '../gp/gp.module';
import { GP } from '../gp/entities/gp.entity';
import { HttpException } from '@nestjs/common';

describe('PatientsService', () => {
  let service: PatientsService;
  let gpService: GpService;
  let notificationService: NotificationsService;
  let entity: Repository<Patient>;

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

  const mockGp = {
    id: 1,
    phoneNumber: '07849 049583',
    surgeryName: 'Test GP',
    address: '64 Zoo Lane',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: GpService,
          useValue: {
            findOne: jest.fn().mockReturnValue(mockGp),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            create: jest
              .fn((x) => x)
              .mockReturnValue({
                save: jest.fn(),
              }),
            save: jest.fn(),
            find: jest.fn().mockReturnValue([mockPatient]),
            findOne: jest.fn().mockReturnValue({
              ...mockPatient,
              save: jest.fn(),
            }),
            findOneBy: jest.fn().mockReturnValue(mockPatient),
          },
        },
        {
          provide: getRepositoryToken(GP),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn().mockReturnValue({
              save: jest.fn(),
            }),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Assessment),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn().mockReturnValue({
              ...mockPatient.assessment,
              save: jest.fn(),
            }),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    gpService = module.get<GpService>(GpService);
    notificationService =
      module.get<NotificationsService>(NotificationsService);
    entity = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call the findOne method on GP', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);
      await service.create(mockPatient);

      expect(gpService.findOne).toHaveBeenCalledWith(mockPatient.gpId);
    });

    it('if no gp with id exists, an exception should be thrown', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);
      (gpService.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(async () => {
        await service.create(mockPatient);
      }).rejects.toThrow(HttpException);
    });

    it('if nhs number is already in use, an exception should be thrown', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(mockPatient);

      expect(async () => {
        await service.create(mockPatient);
      }).rejects.toThrow(HttpException);
    });

    it('if assessment has been set and patient has syringe driver but no setup date, throw an exception', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        assessment: {
          ...mockPatient.assessment,
          syringeDriverSetupDate: null,
        },
      });

      expect(async () => {
        await service.create(mockPatient);
      }).rejects.toThrow(HttpException);
    });

    it('create method on notification service should be called', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      await service.create(mockPatient);

      expect(notificationService.create).toHaveBeenCalledWith({
        content: 'A new patient has been created',
        staff: undefined,
      });
    });

    it('should call the create method on patient repository', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      await service.create(mockPatient);

      expect(entity.create).toHaveBeenCalledWith(mockPatient);
    });

    it('patient save method should be called', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      const saveFnMock = jest.fn();

      (entity.create as jest.Mock).mockReturnValueOnce({
        save: saveFnMock,
      });

      await service.create(mockPatient);

      expect(saveFnMock).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call the patient find method', async () => {
      await service.findAll();

      expect(entity.find).toHaveBeenCalled();
    });

    it('should return patient data', async () => {
      const data = await service.findAll();

      expect(data).toStrictEqual([mockPatient]);
    });
  });

  describe('findFromGp', () => {
    it('should call the patient find method', async () => {
      await service.findFromGp(1);

      expect(entity.find).toHaveBeenCalled();
    });

    it('should return patient data', async () => {
      const data = await service.findFromGp(1);

      expect(data).toStrictEqual([mockPatient]);
    });
  });

  describe('findOne', () => {
    it('should call the patient findOne method', async () => {
      await service.findOne('5343543');

      expect(entity.findOne).toHaveBeenCalled();
    });

    it('should throw an error if the patient is not found', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(async () => {
        await service.findOne('65465465');
      }).rejects.toThrow(HttpException);
    });

    it('should return patient data if found', async () => {
      const saveFnMock = jest.fn();

      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        save: saveFnMock,
      });

      const data = await service.findOne('65465465');

      expect(data).toStrictEqual({
        ...mockPatient,
        save: saveFnMock,
      });
    });
  });

  describe('update', () => {
    it('should call the findOneBy method on the patient repository', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        save: jest.fn(),
      });

      await service.update('432432', {
        firstName: 'Test',
      });

      expect(entity.findOneBy).toHaveBeenCalledWith({
        id: '432432',
      });
    });

    it('should throw an error if no patient is found', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      expect(async () => {
        await service.update('432432', {
          firstName: 'Test',
        });
      }).rejects.toThrow(HttpException);
    });

    it('should call the create method on the notification service', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        save: jest.fn(),
      });

      await service.update('432432', {
        firstName: 'Test',
      });

      expect(notificationService.create).toHaveBeenCalled();
    });

    it('should call the save method on the patient entity', async () => {
      const mockSaveFn = jest.fn();

      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        save: mockSaveFn,
      });

      await service.update('432432', {
        firstName: 'Test',
      });

      expect(mockSaveFn).toHaveBeenCalled();
    });

    it('should return the updated patient first name', async () => {
      const mockSaveFn = jest
        .fn()
        .mockReturnValueOnce({ ...mockPatient, firstName: 'Test' });

      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        save: mockSaveFn,
      });

      const data = await service.update('432432', {
        firstName: 'Test',
      });

      expect(data.firstName).toStrictEqual('Test');
    });
  });

  describe('remove', () => {
    it('should call the findOne method on the service', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        remove: jest.fn(),
      });

      await service.remove('455345');

      expect(entity.findOne).toHaveBeenCalled();
    });

    it('should call the remove method on the patient result', async () => {
      const mockRemoveFn = jest.fn();

      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        remove: mockRemoveFn,
      });

      await service.remove('455345');

      expect(mockRemoveFn).toHaveBeenCalled();
    });

    it('should return the record', async () => {
      const mockRemoveFn = jest.fn().mockReturnValueOnce(mockPatient);

      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockPatient,
        remove: mockRemoveFn,
      });

      const data = await service.remove('455345');

      expect(data).toStrictEqual(mockPatient);
    });
  });
});
