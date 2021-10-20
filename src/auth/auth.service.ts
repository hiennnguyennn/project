import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { userInterface } from 'src/modules/user/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) { }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    const payload = { id: user.id, mail: user.email, salt: 'ajshdjshdjnzdskje' };
    const jwt = await this.jwtService.sign(payload);
    return jwt;
  };
  async findUser(email): Promise<any> {
    return await this.usersService.findOne(email);
  };
  async register(user){
    if(await this.usersService.findOne(user.email)) throw new HttpException('email used',409)
    else{
      const hashPassword=await bcrypt.hash(user.password,await bcrypt.genSalt());
      const createdUser=await this.usersService.create(user,hashPassword);
      const jwt=await this.login(createdUser);
      return {user:this.transfer(user),jwt};
    }

  };
  transfer(user){
    let u:userInterface={email:user.email,name:user.name,id:user.id};
    return u;
  }

}
