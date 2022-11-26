import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NotificationsService } from "../notifications/notifications.service";

// * https://docs.nestjs.com/techniques/task-scheduling#example

@Injectable()
export class TasksService {

    private readonly logger = new Logger(TasksService.name);

    constructor(
        @Inject(NotificationsService)
        private readonly notificationService: NotificationsService
    ) {}

    @Cron('0 0 * * *')
    handleNetworkTraining() {
        this.logger.log('Neural Network training maintenance')
    }

    @Cron('0 2 * * *')
    async handleNotificationDeletion() {
        this.logger.log(`[${Date.now()}] Checking for outdated notifications`);

        const notifications = await this.notificationService.findAll();

        const readNotifications = notifications.filter(notification => notification.read);
        const unreadNotifications = notifications.filter(notification => !notification.read);

        const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
        const oneWeekAgo  = new Date(Date.now() - 120 * 60 * 60 * 1000);

        const outdated = [
            ...readNotifications.filter(notification => notification.lastUpdated <= threeDaysAgo),
            ...unreadNotifications.filter(notification => notification.lastUpdated <= oneWeekAgo),
        ];

        if(!outdated.length)
            return this.logger.log(`[${Date.now()}] No outdated notifications found`);

        outdated.forEach(async notification => await notification.remove());

        this.logger.log(`[${Date.now()}] ${outdated.length} notifications deleted`);
    }
}