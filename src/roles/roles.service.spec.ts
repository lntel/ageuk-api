import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { PermissionTypeEnum } from './types/Permissions';

describe('RolesService', () => {
  let service: RolesService;
  let entity: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue({
              save: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    entity = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const staffId = '1';
  const roleId = 1;
  const roleDto = {
    name: 'test role',
    permissions: [PermissionTypeEnum.MANAGE_PATIENTS],
  };

  describe('create', () => {
    it('should call the findOne method on roleRepository', async () => {
      await service.create(staffId, roleDto);

      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          name: roleDto.name,
        },
      });
    });

    it('if role already exists an exception should be thrown', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(true);

      expect(async () => {
        await service.create(staffId, roleDto);
      }).rejects.toThrow(HttpException);
    });

    it('create method on repository should be called', async () => {
      await service.create(staffId, roleDto);

      expect(entity.create).toHaveBeenCalledWith(roleDto);
    });

    it('should call the save method on the repository object', async () => {
      const saveFnMock = jest.fn();

      (entity.create as jest.Mock).mockReturnValueOnce({
        save: saveFnMock,
      });

      await service.create(staffId, roleDto);

      expect(saveFnMock).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call find method on the role repository', async () => {
      await service.findAll();

      expect(entity.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should call the findOneBy method on the role repository', async () => {
      await service.findOne(roleId);

      expect(entity.findOneBy).toHaveBeenCalledWith({ id: roleId });
    });
  });

  describe('update', () => {
    it('should call the findOne method on role repository', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce({
        save: jest.fn(),
      });

      await service.update(staffId, roleId, roleDto);

      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          id: roleId,
        },
      });
    });

    it('should throw an exception if the role does not exist', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);

      expect(async () => {
        await service.update(staffId, roleId, roleDto);
      }).rejects.toThrow(HttpException);
    });

    it('should replaced updated fields on role object', async () => {
      const roleMock = {
        name: 'some role',
        permissions: [
          PermissionTypeEnum.MANAGE_STAFF,
          PermissionTypeEnum.MANAGE_PATIENTS,
        ],
      };

      const saveFnMock = jest.fn().mockReturnValueOnce(roleDto);

      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...roleMock,
        save: saveFnMock
      });

      await service.update(staffId, roleId, roleDto);

      expect(saveFnMock).toHaveReturnedWith(roleDto);
    });
    
    it('should keep old fields if no new field in update dto', async () => {

      const saveFnMock = jest.fn().mockReturnValueOnce(roleDto);

      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...roleDto,
        save: saveFnMock
      });

      await service.update(staffId, roleId, roleDto);

      expect(saveFnMock).toHaveReturnedWith(roleDto);
    });

    it('should call the save method', async () => {
        const saveFnMock = jest.fn();

        (entity.findOne as jest.Mock).mockReturnValueOnce({
            save: saveFnMock
        });

        await service.update(staffId, roleId, roleDto);

        expect(saveFnMock).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call the findOne method on role repository', async () => {
        (entity.findOne as jest.Mock).mockReturnValueOnce({
            remove: jest.fn()
        });

        await service.remove(staffId, roleId);

        expect(entity.findOne).toHaveBeenCalledWith({
            where: {
                id: roleId
            },
            relations: ['staff']
        });
    });

    it('should throw an error is the role does not exist', async () => {
        (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);

        expect(async () => {
            await service.remove(staffId, roleId);
        }).rejects.toThrow(HttpException);
    });

    it('should throw an error if staff still have the role', async () => {
        (entity.findOne as jest.Mock).mockReturnValueOnce({
            staff: [{}]
        });

        expect(async () => {
            await service.remove(staffId, roleId);
        }).rejects.toThrow(HttpException);
    });

    it('should call the remove method on the role object', async () => {
        const removeFnMock = jest.fn();

        (entity.findOne as jest.Mock).mockReturnValueOnce({
            remove: removeFnMock
        });

        await service.remove(staffId, roleId);

        expect(removeFnMock).toHaveBeenCalled();
    });
  });
});
