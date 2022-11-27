import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Stream } from 'stream';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { RolesService } from '../roles/roles.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';

describe('StaffController', () => {
  let service: StaffService;
  let rolesService: RolesService;
  let entity: Repository<Staff>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            create: jest.fn((x) => x),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
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
      roleId: 1,
      personalPhone: '07465839234'
    };

    it('should throw an exception if the email is already in use', async () => {
      expect(async () => {
        await service.create(mockStaff);
      }).rejects.toThrow(HttpException);
    });

    it('should throw an exception if the role does not exist', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);

      expect(async () => {
        await service.create(mockStaff);
      }).rejects.toThrow(HttpException);
    });

    it('should call the hashSync method on bcrypt', async () => {
      (rolesService.findOne as jest.Mock).mockReturnValue({
        name: 'test role',
      });

      jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce('test');
      (entity.findOne as jest.Mock).mockReturnValue(undefined);

      await service.create(mockStaff);

      expect(bcrypt.hashSync).toHaveBeenCalled();
    });

    it('should call the create method on the staff repository', async () => {
      const roleMock = {
        name: 'test role',
      };

      (rolesService.findOne as jest.Mock).mockReturnValueOnce(roleMock);

      await service.create(mockStaff);

      expect(entity.create).toHaveBeenCalledWith({
        ...mockStaff,
        role: roleMock,
      });
    });

    it('should call the save method on the staff repository', async () => {
      const mockRole = {
        name: 'test role',
      };

      (rolesService.findOne as jest.Mock).mockReturnValue(mockRole);

      await service.create(mockStaff);

      expect(entity.save).toHaveBeenCalledWith({
        ...mockStaff,
        role: mockRole,
      });
    });
  });

  describe('findAll', () => {
    it('should call the find method on the staff repository', async () => {
      await service.findAll();

      expect(entity.find).toHaveBeenCalledWith({
        select: ['dob', 'emailAddress', 'forename', 'id', 'surname', "personalPhone", "workPhone"],
      });
    });
  });

  describe('findOne', () => {
    const staffId = 1;

    const mockStaff: CreateStaffDto = {
      forename: 'john',
      surname: 'doe',
      emailAddress: 'johndoe@test.com',
      dob: new Date(),
      password: 'test',
      roleId: 1,
      personalPhone: '07465839234'
    };

    it('should call the findOne method on the staff repository', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      await service.findOne(staffId);
      
      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          id: staffId
        },
      });
    });
    
    it('should throw an exception if no staff found', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);
      
      expect(async () => {
        await service.findOne(staffId);
      }).rejects.toThrow(HttpException);
      
    });
    
    it('should return a staff object omitting the password field', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);

      const result = await service.findOne(staffId);

      expect(result.password).toBeUndefined();
    });
  });

  describe('findOneBy', () => {
    const key = 'emailAddress';
    const value = 'test@test.com';

    const mockStaff: CreateStaffDto = {
      forename: 'john',
      surname: 'doe',
      emailAddress: 'johndoe@test.com',
      dob: new Date(),
      password: 'test',
      roleId: 1,
      personalPhone: '07856172635'
    };

    it('should call the findOne method on the staff repository', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      await service.findOneBy(key, value);
      
      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          [key]: value,
        },
        relations: ['role']
      });
    });
    
    it('should throw an exception if no staff member is found', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);
      
      expect(async () => {
        await service.findOneBy(key, value);
      }).rejects.toThrow(HttpException);
    });
    
    it('should return the staff member', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      const result = await service.findOneBy(key, value);

      expect(result).toStrictEqual(mockStaff);
    });
  });

  describe('update', () => {

    const mockId = 1;
    const mockStaff = {
      id: 1,
      dob: new Date(),
      emailAddress: 'test@test.com',
      forename: 'test',
      surname: 'test',
      password: 'testing',
      personalPhone: '07586945743',
      save: jest.fn()
    }

    const mockRole = {
      id: 2,
      name: 'test role'
    }

    const mockUpdateDto: UpdateStaffDto = {
      personalPhone: '07812394990',
      password: 'some new password',
      roleId: 2
    };

    beforeEach(async () => {
      (rolesService.findOne as jest.Mock).mockReturnValue(mockRole);
    });
    
    it('should call the findOne method on the staff repository', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      await service.update(mockId, mockUpdateDto);
      
      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          id: mockId
        }
      });
    });
    
    it('should throw an exception if the staff does not exist', async () => {
      expect(async () => {
        await service.update(mockId, mockStaff);
      }).rejects.toThrow(HttpException);
    });
    
    // it('should call the findOne method on the role service if roleId is defined', async () => {
      //   (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      //   await service.update(mockId, mockStaff);
      
      //   expect(rolesService.findOne).toHaveBeenCalledWith(mockUpdateDto.roleId);
      // });

      it('should call the isEmailInUse method if an email is in the DTO', async () => {
        (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
        
        const mockDto = {
          ...mockUpdateDto,
          emailAddress: 'test@test.net'
        };
        
        const spy = jest.spyOn(service, 'isEmailInUse');
        
        await service.update(mockId, mockDto);
        
        expect(spy).toHaveBeenCalledWith(mockDto.emailAddress);
      });
      
      it('should throw an exception if the email already exists', async () => {
        (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
        
        const mockDto = {
          ...mockUpdateDto,
          emailAddress: 'test@test.net'
        };
        
        expect(async () => {
          await service.update(mockId, mockDto);
        }).rejects.toThrow(HttpException);
      });
      
      it('should call the hashSync method when the password is in the update dto', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      await service.update(mockId, mockUpdateDto);
      
      expect(bcrypt.hashSync).toHaveBeenCalledWith(mockUpdateDto.password, 12);
    });
    
    it('should call the staff save method', async () => {
      
      const mockSaveFn = jest.fn();
      
      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockStaff,
        save: mockSaveFn
      });
      
      await service.update(mockId, mockUpdateDto);
      
      expect(mockSaveFn).toHaveBeenCalled();
    });
    
    it('should return the staff object omitting the password', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(mockStaff);
      
      const result = await service.update(mockId, mockUpdateDto);
      
      expect(result.password).toBeUndefined();
    });
  });

  describe('remove', () => {

    const mockStaff = {
      id: 1,
      dob: new Date(),
      emailAddress: 'test@test.com',
      forename: 'test',
      surname: 'test',
      password: 'testing',
      save: jest.fn()
    }

    const mockToken = {
      sub: 2
    };

    beforeEach(() => {
      (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
    });
    
    it('should call the findOne method on the staff repository', async () => {
      await service.remove(mockToken, mockStaff.id);
      
      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          id: mockStaff.id
        }
      });
    });

    it('should throw an exception if the staff is not found', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce(undefined);

      expect(async () => {
        await service.remove(mockToken, mockStaff.id);
      }).rejects.toThrow(NotFoundException);
    });
    
    it('should throw an error if the sub equals the staff id', async () => {
      (entity.findOne as jest.Mock).mockReturnValueOnce({
        ...mockStaff,
        id: 2
      });
      
      expect(async () => {
        await service.remove(mockToken, mockStaff.id);
      }).rejects.toThrow(HttpException);
    });
    
    it('should call the remove method on the staff repository', async () => {
      await service.remove(mockToken, mockStaff.id);
      
      expect(entity.remove).toHaveBeenCalledWith(mockStaff);
    });
  });

  describe('getCurrentUser', () => {
    const mockToken = {
      sub: 1
    };

    const mockStaff = {
      id: 1,
      dob: new Date(),
      emailAddress: 'test@test.com',
      forename: 'test',
      surname: 'test',
      password: 'testing',
      save: jest.fn()
    }

    beforeEach(() => {
      (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
    });

    it('should call the findOne method on the staff repository', async () => {
      await service.getCurrentUser(mockToken);
      
      expect(entity.findOne).toHaveBeenCalledWith({
        where: {
          id: mockToken.sub
        },
        relations: ['role']
      });
    });
    
    it('should return the staff object omitting the password field', async () => {
      const staff = await service.getCurrentUser(mockToken);
      
      expect(staff.password).toBeUndefined();
    });
  });

  describe('updateProfile', () => {
    const mockToken = {
      sub: 1
    };

    const mockStaff = {
      id: 1,
      dob: new Date(),
      emailAddress: 'test@test.com',
      forename: 'test',
      surname: 'test',
      password: '$2a$12$wm9CQ3gqy714IBH6AEbAK.AM1eD4JJDHhO2n5Z.ISBSHQDwHRI68C',
      save: jest.fn()
    }

    const mockUpdateDto: UpdateStaffDto = {
      forename: 'John',
      surname: 'Doe',
      password: 'test'
    }

    it('should call the findOne method on the staff repository', async () => {
      (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
      
      const findOneBySpy = jest.spyOn(service, 'findOneBy')
      
      await service.updateProfile(mockToken, mockUpdateDto);
      
      expect(findOneBySpy).toHaveBeenCalledWith('id', mockToken.sub);
    });
    
    it('should call the compareSync bcrypt method', async () => {
      (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
      
      const spy = jest.spyOn(bcrypt, 'compareSync');
      
      await service.updateProfile(mockToken, mockUpdateDto);
      
      expect(spy).toHaveBeenCalledWith(mockUpdateDto.password, mockStaff.password);
    });
    
    it('should throw an exception if the password is incorrect', async () => {
      (entity.findOne as jest.Mock).mockReturnValue({...mockStaff, password: 'wrong password'});
      
      expect(async () => {
        await service.updateProfile(mockToken, mockUpdateDto);
      }).rejects.toThrow(HttpException);
    });
    
    it('should call the update method on the service', async () => {
      (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
      
      const spy = jest.spyOn(service, 'update');
      
      await service.updateProfile(mockToken, mockUpdateDto);

      expect(spy).toHaveBeenCalledWith(mockToken.sub, {
        ...mockUpdateDto,
        password: undefined
      });
    });
  });

  describe('uploadAvatar', () => {
    
    const mockToken = {
      sub: 1
    };

    // https://stackoverflow.com/a/73493957
    const mockFile: Express.Multer.File = {
      fieldname: "file",
      originalname: "istockphoto-1346124946-170667a.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "./uploads",
      filename: "b1b2caa8-cf7f-4293-9bad-be29997ab2db.jpg",
      path: "uploads\\b1b2caa8-cf7f-4293-9bad-be29997ab2db.jpg",
      size: 78856,
      stream: new Stream.Readable(),
      buffer: Buffer.from('one,two,three'),
    }

    const mockStaff = {
      id: 1,
      dob: new Date(),
      emailAddress: 'test@test.com',
      forename: 'test',
      surname: 'test',
      avatarFilename: 'b1b2caa8-cf7f-4293-9bad-be29997ab2db.jpg',
      password: '$2a$12$wm9CQ3gqy714IBH6AEbAK.AM1eD4JJDHhO2n5Z.ISBSHQDwHRI68C',
      save: jest.fn()
    }

    // it('should call the findOneBy method on the service', async () => {
    //   (entity.findOne as jest.Mock).mockReturnValue(mockStaff);

    //   await service.uploadAvatar(mockStaff, mockFile);
    // });
    
    // it('should call the unlink method if the staff has an avatar', async () => {
    //   (entity.findOne as jest.Mock).mockReturnValue(mockStaff);
    //   jest.mock('fs');
    //   (fs.unlinkSync as jest.Mock).mockReturnValue(true);
  
    //   await service.uploadAvatar(mockStaff, mockFile);
      
    //   const spy = jest.spyOn(fs, 'unlinkSync');

    //   expect(spy).toHaveBeenCalledWith(join(__dirname, '../..', 'uploads', mockStaff.avatarFilename));
    // });
  });
});
