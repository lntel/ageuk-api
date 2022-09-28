import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concatMap, delay, from, interval, map, Observable, of, switchMap } from 'rxjs';
import { StaffService } from 'src/staff/staff.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => StaffService))
    private readonly staffService: StaffService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = Notification.create({
      verb: createNotificationDto.verb,
      entityName: createNotificationDto.entityName,
      system: createNotificationDto.system,
      message: createNotificationDto.message,
    });

    if (createNotificationDto.system) {
      if (!createNotificationDto.message)
        throw new HttpException(
          'System notifications must contain a message',
          HttpStatus.BAD_REQUEST,
        );

      notification.verb = null;
      notification.entityName = null;
    }

    if (createNotificationDto.staffId && !createNotificationDto.system) {
      const staff = await this.staffService.findOneBy(
        'id',
        createNotificationDto.staffId,
      );

      notification.performedBy = staff;
    }

    const result = await notification.save();

    // Protecting personal data from request
    result.performedBy = undefined;

    return result;
  }

  async findAll() {
    // Not sure if theres a better way to do this
    let notifications = await this.notificationRepository.find({
      relations: ['performedBy'],
      select: {
        id: true,
        entityName: true,
        message: true,
        system: true,
        verb: true,
        performedBy: {
          forename: true,
          surname: true,
        },
        createdAt: true
      }
    });

    return notifications;
  }

  async sse() {

    const result = await this.notificationRepository.find({
      relations: ['performedBy'],
      select: {
        id: true,
        message: true,
        createdAt: true,
        entityName: true,
        performedBy: {
          forename: true,
          surname: true
        },
        system: true,
        verb: true
      }
    });

    return from(result).pipe(
      map(res => ({ data: res })),
      delay(2000)
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
