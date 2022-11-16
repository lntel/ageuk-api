import { Inject, Injectable } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { InjectRepository } from '@nestjs/typeorm';
import { concatMap, interval, map } from 'rxjs';
import { Repository } from 'typeorm';
import { StaffService } from '../staff/staff.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(StaffService)
    private readonly staffService: StaffService,
  ) {}

  // await this.staffService.findOne(createNotificationDto.staff)
  @UsePipes(new ValidationPipe())
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      content: createNotificationDto.content,
      read: !createNotificationDto.staff ? null : false,
    });

    if (createNotificationDto.staff)
      notification.staff = await this.staffService.findOneBy(
        'id',
        String(createNotificationDto.staff),
      );

    return await notification.save();
  }

  async sse(user: any) {
    console.log(user);

    return interval(2000).pipe(
      concatMap(async () => await this.findAll(user)),
      map((r) => ({ data: r })),
    );
  }

  // TODO find a way to use or on the same field
  async findAll(user: any) {
    let notifications = await this.notificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    // ! This is a workaround since OR is not available with this kind of typeorm query
    notifications = notifications.filter(
      (notification) => notification.staff === user.sub || !notification.staff && !notification.read,
    );

    return notifications;
  }

  // TODO implement and test this
  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  async update(id: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: String(id),
    });

    if (!notification)
      throw new HttpException(
        'This notification does not exist',
        HttpStatus.NOT_FOUND,
      );

    if (notification.read === null)
      throw new HttpException(
        'Read receipts are disabled on this notification',
        HttpStatus.BAD_REQUEST,
      );

    if (notification.read)
      throw new HttpException(
        'This notification has already been marked as read',
        HttpStatus.FORBIDDEN,
      );

    notification.read = true;

    return notification.save();
  }

  async remove(id: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: String(id),
    });

    notification.remove();
  }
}
