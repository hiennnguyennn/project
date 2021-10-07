import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        console.log(request?.cookies?.["jwt"]);
        return JSON.stringify(request?.cookies?.["jwt"]);
      }]),
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',

    })
  }

  async validate(payload: any) {
    console.log(1);
    return { mail: payload.mail };
  }

}
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([ (request: Request) => {
//                  console.log(request?.cookies?.["jwt"])
//                  return request?.cookies?.["jwt"];
//                }]),
//       ignoreExpiration: false,
//       secretOrKey: 'secret',
//     });
//   }

//   async validate(payload: any) {
//     console.log(1);
//     return { payload};
//   }
// }