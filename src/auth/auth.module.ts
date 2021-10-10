import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.stragery';


@Module({
  imports:[PassportModule,
    JwtModule.register({
      secret:'secret',
      signOptions:{expiresIn:'60s'}
    }),
    forwardRef(() => UserModule),
   
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
