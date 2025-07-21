import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/infrastructure/users.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [DbModule, UsersModule, SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
