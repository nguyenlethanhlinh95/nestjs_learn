// src/users/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { hash, compare } from 'bcrypt';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  refreshToken: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    const saltRounds = 10;
    this.password = await hash(password, saltRounds);
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.password);
  }
}
