import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET_KEY'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
  ],
  providers: [
    ConfigService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
