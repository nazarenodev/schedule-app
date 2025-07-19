import { Injectable } from '@nestjs/common';
import { PrismaProvider as PrismaService } from '../../db/prisma.provider';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UserPrismaRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.getId(),
        email: user.getEmail(),
        password: user.getPasswordHash(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    });
    return User.create(createdUser.email, createdUser.password); // Reconstruct domain entity
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return null;
    }
    return User.create(user.email, user.password); // Reconstruct domain entity
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    return User.create(user.email, user.password); // Reconstruct domain entity
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => User.create(user.email, user.password)); // Reconstruct domain entities
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.getId() },
      data: { email: user.getEmail(), password: user.getPasswordHash(), updatedAt: user.getUpdatedAt() },
    });
    return User.create(updatedUser.email, updatedUser.password); // Reconstruct domain entity
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}