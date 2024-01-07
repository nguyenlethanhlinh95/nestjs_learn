import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsBoolean } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  @IsBoolean()
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
