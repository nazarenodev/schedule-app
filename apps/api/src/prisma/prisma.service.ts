import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma client connected to the database.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

}
