import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import UserService from './user.service';
import UserRepository from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
