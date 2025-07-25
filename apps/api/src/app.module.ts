import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/infrastructure/users.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [UsersModule, SchedulerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
