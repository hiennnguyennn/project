import { HttpException, Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserLoginDto } from './DTO/user.login.dto';
import { UserDto } from './DTO/userDto';
import { TagName } from 'src/tagname/entity/tagname.entity';
import { Post } from 'src/posts/entity/post.entity';
import { Comment } from 'src/comments/entity/comment.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
    private tagRepository=getRepository(TagName);
    private postRepository=getRepository(Post);
    private commentRepository=getRepository(Comment);
    constructor(
        @InjectQueue('mail') private readonly mailQueue: Queue,
        @InjectRepository(User)
        private usersRepository: Repository<User>,

    ) { }
    findAll(): Promise<any> {
        return new Promise(resolve => {
            resolve(this.usersRepository.find());
        })
    };

    checkOwn(userId,id,tmp):Promise<any>{
        return new Promise(async resolve=>{
            let result;
            if(tmp==='tag'){
                const t=await this.tagRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            else if(tmp=='post'){
                const t=await this.postRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            else if(tmp=='comment'){
                const t=await this.commentRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            resolve(result);
        })
    }

    async findOne(email: string): Promise<any> {
        return await this.usersRepository.findOne({ where: { email: email } });
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
                
                await this.mailQueue.add('transcode', { mail: user.email });
                console.log('mail');
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
                const saveUser = await this.usersRepository.findOne({ where: { email: user.email } });
                // const jwt = await this.jwtService.sign({ id: saveUser.id, email: saveUser.email });
                 //console.log(jwt);
                 resolve(saveUser);
            }

        })
    };
    // handleLogin(user: any): Promise<any> {
    //     return new Promise(async resolve => {
    //         var u = await this.usersRepository.findOne({
    //             where: { email: user.email }, relations: ['listTagNames']
    //         });
    //         if (u == null) resolve('not exist mail');
    //         else {
    //             if (!await bcrypt.compare(user.password, u.password)) {
    //                 resolve('wrong password')
    //             }
    //             else {
    //                 //  const jwt = await this.jwtService.sign({ id: u.id, email: u.email });
    //                 // resolve({u,jwt});
    //             }
    //         }
    //         // else {
    //         //     //resolve(bcrypt.compare(user.password, u.password));
    //         //     if (bcrypt.compare(user.password, u.password)) {
    //         //         resolve(u);

    //         //     }
    //         //     else {
    //         //         resolve('wrong password');
    //         //         //const jwt = await this.jwtService.sign({ id: existMail.id, email: existMail.email });
    //         //         //resolve({ existMail, jwt })
    //         //     };
    //         // }
    //     })
    // }

}
