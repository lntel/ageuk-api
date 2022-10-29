import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from '../staff/staff.service';
import { GpController } from './gp.controller';
import { GpService } from './gp.service';

describe('GpController', () => {
  let controller: GpController;
  let service: GpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GpController],
      providers: [
        {
          provide: GpService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: StaffService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<GpController>(GpController);
    service = module.get<GpService>(GpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      surgeryName: 'test surgery',
      address: 'test address',
      phoneNumber: '07584 746596',
    };

    it('create service method should be called', async () => {
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith({}, dto);
    });
  });

  describe('findAll', () => {
    it('findAll service method should be called', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('findOne service method should be called', async () => {
      await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    const dto = {
      surgeryName: 'new test surgery name',
    };

    it('update service method should be called', async () => {
      await controller.update({}, '1', dto);

      expect(service.update).toHaveBeenCalledWith({}, 1, dto);
    });
  });

  describe('remove', () => {
    it('remove service method should be called', async () => {
      await controller.remove({}, '1');

      expect(service.remove).toHaveBeenCalledWith({}, 1);
    });
  });
});
