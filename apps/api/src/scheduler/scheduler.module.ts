import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { PrismaProvider } from 'src/db/prisma.provider';

@Module({    
    controllers: [SchedulerController],
    providers: [PrismaProvider, SchedulerService],
})
export class SchedulerModule {}