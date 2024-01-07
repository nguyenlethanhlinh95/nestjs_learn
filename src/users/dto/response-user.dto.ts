import { IsNumber, IsString, IsArray, isArray } from 'class-validator';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsArray()
  tasks: User[];
}
