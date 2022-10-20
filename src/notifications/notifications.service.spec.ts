import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffService } from '../staff/staff.service';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let entity: Repository<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            create: jest.fn().mockReturnValue({
              save: jest.fn(),
            }),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn().mockReturnValue({
              save: jest.fn(),
              read: false,
            }),
          },
        },
        {
          provide: StaffService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    entity = module.get<Repository<Notification>>(getRepositoryToken(Notification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      content: 'This is a test',
      staff: 1,
    };

    it('should create a new notification', async () => {
      await service.create(dto);

      expect(entity.create).toHaveBeenCalled();
    });

    it('should save the new notification', async () => {
      await service.create(dto);

      expect(entity.create().save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call the find method on the repository', async () => {
      const user = {
        sub: 1,
      };

      await service.findAll(user);

      expect(entity.find).toHaveBeenCalledWith({
        where: {
          staff: user.sub,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    });
  });

  describe('update', () => {
    it('should call the findOneBy method on the notification repository', async () => {
      const id = 1;

      await service.update(id);

      expect(entity.findOneBy).toHaveBeenCalledWith({
        id: String(id),
      });
    });

    it('notification read should be false', async () => {
      const result = await entity.findOneBy({
        id: String(1),
      });

      expect(result.read).toStrictEqual(false);
    });

    it('should throw exception if read is true', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce({
        save: jest.fn(),
        read: true,
      });

      // https://stackoverflow.com/a/68557059
      expect(async () => {
        await service.update(1);
      }).rejects.toThrow(HttpException);
    });

    it('should mark the notification as read', async () => {
      await service.update(1);

      const result = await entity.findOneBy({
        id: String(1),
      });

      expect(result.read).toStrictEqual(true);
    });

    it('should save the notification', async () => {
      await service.update(1);

      const result = await entity.findOneBy({
        id: String(1),
      });

      expect(result.save).toHaveBeenCalled();
    });
  });
});
