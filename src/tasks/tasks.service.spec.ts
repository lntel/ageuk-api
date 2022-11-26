import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { TasksService } from './tasks.service';

describe('TaskService', () => {
  let taskService: TasksService;
  let notificationService: NotificationsService;
  let loggerMock: Logger;

  const notifications = [
    {
      id: '1',
      content: 'test',
      createdAt: new Date(),
      lastUpdated: new Date(),
      read: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TasksService,
        {
          provide: NotificationsService,
          useValue: {
            findAll: jest.fn().mockReturnValue({
              filter: jest.fn((x) => x).mockReturnValue(notifications),
            }),
          },
        },
        {
            provide: Logger,
            useValue: {
                log: jest.fn()
            }
        }
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    notificationService = module.get<NotificationsService>(NotificationsService);
  });

  describe('handleNotificationDeletion', () => {

    it('should call the log method on the logger', async () => {
        await taskService.handleNotificationDeletion();

        expect(loggerMock.log).toHaveBeenCalled();
    });

    it('should call the findAll method on the notification repository', async () => {
      await taskService.handleNotificationDeletion();
      
      expect(notificationService.findAll).toHaveBeenCalled();
    });
    
    it('should call the filter method on the notification for read notifications', async () => {
        const filterMock = jest.fn().mockResolvedValue(notifications);
        
        (notificationService.findAll as jest.Mock).mockReturnValueOnce({
            filter: filterMock
        });
        
        await taskService.handleNotificationDeletion();

        expect(filterMock).toHaveBeenCalled();
    });
    
    it('should call the filter method on the notification for unread notifications', async () => {
        const filterMock = jest.fn().mockResolvedValue(notifications);
        
        (notificationService.findAll as jest.Mock).mockReturnValueOnce({
            filter: filterMock
        });
        
        await taskService.handleNotificationDeletion();

        expect(filterMock).toHaveBeenCalled();
    });
    
    it('should log outdated notifications if no outdated notifications were found', async () => {
        (notificationService.findAll as jest.Mock).mockReturnValueOnce({
            filter: jest.fn().mockReturnValueOnce([])
        });
        
        await taskService.handleNotificationDeletion();
    
        expect(loggerMock.log).toHaveBeenCalledWith();
    });
    
    it('should iterate through all the oudated notifications and call the remove method for each', async () => {
        const mockRemoveFn = jest.fn();
        
        (notificationService.findAll as jest.Mock).mockReturnValueOnce([{
            filter: jest.fn(x => x).mockReturnValueOnce([
                {
                    ...notifications,
                    filter: jest.fn(x => x).mockReturnValueOnce([
                        {
                            remove: mockRemoveFn
                        },
                        {
                            remove: mockRemoveFn
                        },
                        {
                            remove: mockRemoveFn
                        }
                    ])
                },
            ])
        }]);
        
        await taskService.handleNotificationDeletion();
    
        expect(mockRemoveFn).toHaveBeenCalledTimes(3);
    });
  });
});
