import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {}
        },
        {
          provide: StaffService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method on the service', async () => {
      const createDto = {
        forename: 'John',
        surname: 'Doe',
        dob: new Date(),
        emailAddress: 'johndoe@test.com',
        password: 'some password',
        roleId: 1,
        personalPhone: '07465839234'
      };

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should call the findAll method on the service', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
    });

    it('should call the findOne method on the service', async () => {
      const id = '1';

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(Number(id));
    });

    it('should call the update method on the service', async () => {
      const updateDto: UpdateStaffDto = {
        forename: 'test change',
      };

      const id = '1';

      await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(Number(id), updateDto);
    });

    it('should call the remove method on the service', async () => {
      const staffId = '1';
      const id = '1';

      await controller.remove(staffId, id);

      expect(service.remove).toHaveBeenCalledWith(staffId, Number(id));
    });
  });
});
