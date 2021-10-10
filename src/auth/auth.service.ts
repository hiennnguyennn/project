import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) { }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
    //return user;
  }
  async login(user: any) {
    const payload = { id: user.id, mail: user.email, salt: 'ajshdjshdjnzdskje' };
    const jwt = await this.jwtService.sign(payload);
    return jwt;
  };
  async findUser(email): Promise<any> {
    return await this.usersService.findOne(email);
  }

}
