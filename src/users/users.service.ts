import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '@app/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    console.log('newUser', newUser);
    return await this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: any): Promise<User | null> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    await this.usersRepository.update({ id }, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }

  findWhere(where) {
    return this.usersRepository.findOneBy(where);
  }

  findOneOptions(options) {
    return this.usersRepository.findOne(options);
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_ACCESS_SECRET,
    );
  }

  buildUserResponse(user: User) {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
