import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({    
    imports: [PrismaModule],
    controllers: [SchedulerController],
    providers: [SchedulerService],
})
export class SchedulerModule {}