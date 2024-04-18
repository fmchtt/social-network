import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import UserRepository from 'src/user/user.repository';
import { TokenResult } from './auth.results';
import { JwtService } from '@nestjs/jwt';
import { CreateUserCommand, LoginUserCommand } from './auth.commands';
import { cpus } from 'os';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async hash(key: string): Promise<string> {
    const hashedKey = await argon2.hash(key, {
      parallelism: cpus().length,
    });
    return hashedKey;
  }

  async verify(hashedKey: string, key: string): Promise<boolean> {
    return await argon2.verify(hashedKey, key);
  }

  async register(command: CreateUserCommand): Promise<TokenResult> {
    const userFound = await this.userRepository.getByUsername(command.username);
    if (userFound) {
      throw new BadRequestException('username indisponible');
    }

    const user = await this.userRepository.create({
      ...command,
      password: await this.hash(command.password),
    });

    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.config.get<string>('SECRET_KEY'),
      },
    );

    return new TokenResult(token);
  }

  async login(command: LoginUserCommand): Promise<TokenResult> {
    const userFound = await this.userRepository.getByUsername(command.username);
    if (!userFound) {
      throw new BadRequestException({
        message: 'username or password incorrect',
      });
    }

    const validPassword = this.verify(userFound.password, command.password);
    if (!validPassword) {
      throw new BadRequestException({
        message: 'username or password incorrect',
      });
    }

    const token = this.jwtService.sign(
      { sub: userFound.id },
      {
        secret: this.config.get<string>('SECRET_KEY'),
      },
    );

    return new TokenResult(token);
  }
}
