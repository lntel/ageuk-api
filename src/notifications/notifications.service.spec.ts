import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from '../staff/entities/staff.entity';
import { StaffService } from '../staff/staff.service';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const mockNotification = {
      content: 'This is a test',
    };

    const mockStaff = {
      forename: 'Test name',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            save: jest.fn().mockResolvedValue(mockNotification),
            find: jest.fn().mockResolvedValue([mockNotification]),
          },
        },
        {
          provide: StaffService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockStaff),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
