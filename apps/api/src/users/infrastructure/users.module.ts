import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersController } from './users.controller';
import { PrismaProvider } from 'src/db/prisma.provider';
import { UserRepository } from '../domain/user.repository';
import { UserPrismaRepository } from './users.prisma.repository';


@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaProvider,
    UsersService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository
    }
  ],
})
export class UsersModule {}
