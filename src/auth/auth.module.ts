import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    ConfigModule,
    PassportModule.register({ 
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600
        }
      })
    }),
    TypeOrmModule.forFeature([ User ]),
  ],
  providers: [UsersRepository, AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy, PassportModule]

})
export class AuthModule {}
