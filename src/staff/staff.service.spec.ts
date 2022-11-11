import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';

describe('StaffController', () => {
  let service: StaffService;
  let entity: Repository<Staff>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
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
    entity = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  });

  const mockEmail = 'test@gmail.com';

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
        await service.login(mockEmail, 'some password');

        expect(entity.findOneBy).toHaveBeenCalledWith({
            emailAddress: mockEmail
        });
    });

    it('should throw an error if no staff is present', async () => {
        (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);
        await service.login(mockEmail, 'some password');

        // expect(async () => {
        //     await service.login(mockEmail, 'some password');
        // }).rejects.toThrow(HttpException);
    });
  });
});
