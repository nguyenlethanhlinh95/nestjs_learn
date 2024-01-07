import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  email: string;

  @IsString()
  refreshToken: string;
}
