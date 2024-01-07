import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RegisterDto {
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
}
