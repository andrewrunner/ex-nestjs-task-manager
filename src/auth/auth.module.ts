import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
        secret: '12adasdASDweq3123123',
        signOptions: {
          expiresIn: 3600
        }
    }),
    TypeOrmModule.forFeature([ User ]),
  ],
  providers: [UsersRepository, AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy, PassportModule]

})
export class AuthModule {}
