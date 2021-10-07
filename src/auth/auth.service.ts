import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AnyRecord } from 'dns';
import { User } from 'src/user/user.entity';
import { UserLoginDto } from 'src/user/user.login.dto';
import { UserService } from 'src/user/user.service';
import { getRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) { }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compare(pass,user.password)) {
      
      return user;
    }
    return null;
   //return user;
  }
  async login(user: UserLoginDto) {
    const payload = { mail: user.email ,hello:'ajdshksacmlkaje'};
    const jwt= await this.jwtService.sign(payload);
    return jwt;
   return {
     access_token: this.jwtService.sign(payload),
   };
  };
  
 
}
