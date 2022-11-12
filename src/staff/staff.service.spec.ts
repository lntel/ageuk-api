import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';
import { compareSync, hashSync } from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';

describe('StaffController', () => {
  let service: StaffService;
  let rolesService: RolesService;
  let entity: Repository<Staff>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn().mockReturnValue(undefined)
          },
        },
        {
          provide: Staff,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    rolesService = module.get<RolesService>(RolesService);
    entity = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  });

  const mockEmail = 'test@gmail.com';
  const mockPasswordHash =
    '$2a$12$wm9CQ3gqy714IBH6AEbAK.AM1eD4JJDHhO2n5Z.ISBSHQDwHRI68C';

  it('should be defined', () => {
    expect(entity).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('isEmailInUse', () => {
    it('should call the findOne method on the staff repository', async () => {
      await service.isEmailInUse(mockEmail);

      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          emailAddress: mockEmail,
        },
      });
    });
  });

  describe('login', () => {
    it('should call the findOneBy method on the staff repository', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        emailAddress: mockEmail,
        password: mockPasswordHash,
      });

      await service.login(mockEmail, 'test');

      expect(entity.findOneBy).toHaveBeenCalledWith({
        emailAddress: mockEmail,
      });
    });

    it('should throw an error if no staff is present', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      expect(async () => {
        await service.login(mockEmail, 'test');
      }).rejects.toThrow(HttpException);
    });

    it('should throw an exception if the password does not match', async () => {
      expect(async () => {
        await service.login(mockEmail, 'wrong password');
      }).rejects.toThrow(HttpException);
    });

    it('should return a staff object', async () => {
      const staffMock = {
        emailAddress: mockEmail,
        password: mockPasswordHash,
      };

      (entity.findOneBy as jest.Mock).mockReturnValueOnce(staffMock);

      const result = await service.login(mockEmail, 'test');

      expect(result).toStrictEqual(staffMock);
    });
  });

  describe('create', () => {

    const mockStaff: CreateStaffDto = {
      forename: 'john',
      surname: 'doe',
      emailAddress: 'johndoe@test.com',
      dob: new Date(),
      password: 'test',
      roleId: 1
    }

    it('should throw an exception if the email is already in use', async () => {
      expect(async () => {
        await service.create(mockStaff)
      }).rejects.toThrow(HttpException);
    });
    
    it('should throw an exception if the role does not exist', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);
      
      expect(async () => {
        await service.create(mockStaff)
      }).rejects.toThrow(HttpException);
    });

    it('should call the hashSync method on bcrypt', async () => {
      (rolesService.findOne as jest.Mock).mockReturnValue({
        name: 'test role'
      });
      (entity.findOne as jest.Mock).mockReturnValue(undefined);

      await service.create(mockStaff);

      expect(hashSync).toHaveBeenCalled();
    });
  });
});
