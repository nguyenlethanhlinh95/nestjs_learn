import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
// import { UserRepository } from '../user/user.repository';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@app/config';
import { CreateUserDto } from '@app/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findWhere({
      username: createUserDto.username,
    });
    if (userExists) {
      // throw new ConflictException('Username is already taken.');
      throw new BadRequestException('Username already exists');
    }

    const user = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(username: string, password: string) {
    const user = await this.usersService.findWhere({ username });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }
    if (!(await compare(password, user.password))) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.getTokens(user.id, user.username);
    delete user.password;
    return {
      user: {
        ...user,
        ...tokens,
      },
    };
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  // private generateAccessToken(user: User): string {
  //   const payload = { username: user.username, id: user.id };
  //   return this.jwtService.sign(payload, { secret: JWT_SECRET });
  // }

  async validate(username: string, password: string) {
    const user = await this.usersService.findWhere({ username });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken);
    console.log(`hashedRefreshToken ${hashedRefreshToken}`);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
