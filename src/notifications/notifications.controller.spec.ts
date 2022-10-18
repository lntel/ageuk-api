import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockNotification = {
    content: 'This is a test',
    read: false
  };

  beforeEach(async () => {

    // https://stackoverflow.cóom/a/64720908
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(x => x),
            findAll: jest.fn().mockResolvedValue([mockNotification]),
            update: jest.fn(x => x).mockResolvedValue({
              ...mockNotification,
              read: true
            }),
          }
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {

    const mockRecord = {
      staff: 34,
      content: 'This is a test'
    };

    it('should create a new notification', async () => {
      const result = await controller.create(mockRecord);

      expect(result).toStrictEqual(mockRecord);
    });
  });

  describe('findAll', () => {

    it('should find all notifications belonging to a staff member', async () => {
      const result = await controller.findAll(34);

      expect(result).toStrictEqual([mockNotification]);
    });

  });

  describe('update', () => {

    it('should mark the notification as read', async () => {
      const result = await controller.update('1');

      expect(result.read).toStrictEqual(true);
    });

  });
});
