import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { StaffService } from 'src/staff/staff.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService, StaffService],
    })
    .overrideGuard(PermissionGuard).useValue({ canActivate: jest.fn().mockReturnValue(true) })
    .compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
