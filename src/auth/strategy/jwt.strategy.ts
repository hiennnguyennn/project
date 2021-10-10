import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.["jwt"];
      }]),
      ignoreExpiration: false,
      secretOrKey: 'secret',

    })
  }

  async validate(payload: any) {
    let user=await this.authService.findUser(payload.mail);
    delete user.password;
    return user;
  }

}
