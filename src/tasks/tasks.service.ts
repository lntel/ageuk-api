import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

// * https://docs.nestjs.com/techniques/task-scheduling#example

@Injectable()
export class TasksService {

    private readonly logger = new Logger(TasksService.name);

    @Cron('0 0 * * *')
    handleNetworkTraining() {
        this.logger.log('Neural Network training maintenance')
    }

}