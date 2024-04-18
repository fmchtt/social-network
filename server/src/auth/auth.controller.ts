import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserCommand, LoginUserCommand } from './auth.commands';
import { Public } from './auth.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  public async login(@Body() command: LoginUserCommand) {
    return await this.authService.login(command);
  }

  @Post('/register')
  public async register(@Body() command: CreateUserCommand) {
    return await this.authService.register(command);
  }
}
