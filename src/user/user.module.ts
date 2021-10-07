import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.process';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:
   [
     TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: 'abc',
    signOptions: { expiresIn: '60s' },
  }),
    BullModule.registerQueue({name:'mail'}),
    
  ],
  controllers: [UserController],
  providers: [UserService,MailProcessor,AuthService],
  exports:[UserService]
})
export class UserModule { }
