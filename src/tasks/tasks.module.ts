import { Module } from "@nestjs/common";
import { NotificationsModule } from "src/notifications/notifications.module";
import { TasksService } from "./tasks.service";

@Module({
    imports: [NotificationsModule],
    providers: [TasksService]
})
export class TasksModule {}