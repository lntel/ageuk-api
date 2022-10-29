import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from '../staff/staff.service';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PermissionTypeEnum } from './types/Permissions';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const staffMock = {
    sub: 1
  }

  beforeEach(async () => {
    // https://stackoverflow.cóom/a/64720908
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: StaffService,
          useValue: {},
        },
        {
          provide: RolesService,
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

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {

    const mockDto = {
        name: 'test role',
        permissions: [PermissionTypeEnum.MANAGE_PATIENTS]
    };

    it('should call the create method on the service', async () => {
        await controller.create(staffMock, mockDto);

        expect(service.create).toHaveBeenCalledWith(staffMock, mockDto)
    });
  });
  
  describe('findAll', () => {
    it('should call the findAll method on the service', async () => {
        await controller.findAll();

        expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {

    const id = '1';

    it('should call the findOne method on the service', async () => {
        await controller.findOne(id);

        expect(service.findOne).toHaveBeenCalledWith(Number(id));
    });
  });

  describe('update', () => {

    const id = '1';
    const mockDto = {
        name: 'test role',
        permissions: [PermissionTypeEnum.MANAGE_PATIENTS, PermissionTypeEnum.MANAGE_STAFF]
    };

    it('should call the update method on the service', async () => {
        await controller.update(staffMock, id, mockDto);

        expect(service.update).toHaveBeenCalledWith(staffMock, Number(id), mockDto);
    });
  });

  describe('remove', () => {

    const id = '1';

    it('should call the remove method on the service', async () => {
        await controller.remove(staffMock, id);

        expect(service.remove).toHaveBeenCalledWith(staffMock, Number(id));
    });
  });
});
