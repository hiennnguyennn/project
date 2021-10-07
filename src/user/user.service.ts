import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserLoginDto } from './user.login.dto';
import { UserDto } from './userDto';


@Injectable()
export class UserService {
   
    constructor(
        @InjectQueue('mail') private readonly mailQueue:Queue,
        private jwtService: JwtService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
       
    ) { }
    findAll(): Promise<any> {
        return new Promise(resolve => {
            resolve(this.usersRepository.find());
        })
    };

    async findOne(username: string): Promise<any> {
        return await this.usersRepository.findOne({where:{email:username}});
      }

    // async findOne(email,password): Promise<any> {
    //     return new Promise(async resolve=>{
    //         var u = await this.usersRepository.findOne({
    //             where: { email: email }
    //         });
    //         if (u == null) resolve('not exist mail');
    //         else{
    //             if(!await bcrypt.compare(password,u.password)){
    //                 resolve('wrong password')
    //             }
    //             else{
    //                 const jwt = await this.jwtService.sign({ id: u.id, email: u.email });
    //                  resolve(u);
    //             }
    //         }
    //     })
    //   }
    
    saveUser(user: any): Promise<any> {
        return new Promise(async resolve => {

            var exist = await this.usersRepository.findOne({
                where: { email: `${user.email}` }
            });
            if (exist != null) resolve('exist')
            else {
                user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
                await this.mailQueue.add('transcode',{mail:user.email})
                await this.usersRepository.save(user);
                // const nodeMailer = require('nodemailer');
                // const transporter = nodeMailer.createTransport({
                //     service: "Gmail",
                //     auth: {
                //         user: "hienntt183734@gmail.com",
                //         pass: "hien842850"
                //     }
                // });
                // const option = {
                //     from: "hienntt183734@gmail.com",
                //     to: user.email,
                //     subject: "Login",
                //     text: "Login successfully"
                // };
                // transporter.sendMail(option, function (err, info) {
                //     if (err) {
                //         console.log(err);
                //         return;
                //     }
                //     console.log("Sent: " + info.response);
                // })
                const saveUser= await this.usersRepository.findOne({where:{ email: user.email }});
                const jwt = await this.jwtService.sign({ id: saveUser.id, email: saveUser.email });
                resolve({u:saveUser,jwt});
            }

        })
    };
    handleLogin(user: any): Promise<any> {
        return new Promise(async resolve => {
            var u = await this.usersRepository.findOne({
                where: { email: user.email },relations:['listTagNames']
            });
            if (u == null) resolve('not exist mail');
            else{
                if(!await bcrypt.compare(user.password,u.password)){
                    resolve('wrong password')
                }
                else{
                    const jwt = await this.jwtService.sign({ id: u.id, email: u.email });
                     resolve({u,jwt});
                }
            }
            // else {
            //     //resolve(bcrypt.compare(user.password, u.password));
            //     if (bcrypt.compare(user.password, u.password)) {
            //         resolve(u);
                    
            //     }
            //     else {
            //         resolve('wrong password');
            //         //const jwt = await this.jwtService.sign({ id: existMail.id, email: existMail.email });
            //         //resolve({ existMail, jwt })
            //     };
            // }
        })
    }

}
