import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserResult } from './user.results';

@Controller('users')
export class UserController {
  @Get('me')
  public getActualUser(@Req() request: Request) {
    return new UserResult(request.user);
  }
}
