import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../domain/user.repository';
import { UserPrismaRepository } from './users.prisma.repository';


@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UsersService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository
    }
  ],
})
export class UsersModule {}
