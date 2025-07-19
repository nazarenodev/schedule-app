import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = User.create(createUserDto.email, createUserDto.password);
    const savedUser = await this.userRepository.create(user);
    return {
      id: savedUser.getId(),
      email: savedUser.getEmail(),
      createdAt: savedUser.getCreatedAt(),
    } as Partial<User>;
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return users.map(user => ({
      id: user.getId(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt(),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
