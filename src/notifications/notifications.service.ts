import { Inject, Injectable } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffService } from 'src/staff/staff.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(StaffService)
    private readonly staffService: StaffService,
  ) {}

  @UsePipes(new ValidationPipe())
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      content: createNotificationDto.content,
      staff: await this.staffService.findOne(createNotificationDto.staff),
    });

    return await notification.save();
  }

  // TODO find a way to use or on the same field
  async findAll(user: any) {
    const notifications = await this.notificationRepository.find({
      where: {
        staff: user.sub,
      },
    });

    return notifications;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepository.findOneBy({
      id: String(id),
    });

    if (notification.read)
      throw new HttpException(
        'This notification has already been marked as read',
        HttpStatus.FORBIDDEN,
      );

    notification.read = true;

    return notification.save();
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
