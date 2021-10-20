import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService,private configService:ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.["jwt"];
      }]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),

    })
  }

  async validate(payload: any) {
    let user=await this.authService.findUser(payload.mail);
    return this.authService.transfer(user);
  }

}
