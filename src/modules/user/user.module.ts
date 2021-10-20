import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../../common/service/mail.process';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([User]),
      BullModule.registerQueue({ name: 'mail' }),
      forwardRef(() => AuthModule)
    ],
  controllers: [UserController],
  providers: [UserService, MailProcessor],
  exports: [UserService]
})
export class UserModule { }
