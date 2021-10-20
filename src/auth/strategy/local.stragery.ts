import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { userInterface } from 'src/modules/user/interface/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'email'});
  }

  async validate(email:string,password:string): Promise<userInterface> {
    const u = await this.authService.validateUser(email, password);
    if (!u) {
      throw new UnauthorizedException();
    }
    return this.authService.transfer(u);
  };
}