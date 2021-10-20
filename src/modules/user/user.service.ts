import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TagName } from 'src/modules/tagname/entity/tagname.entity';
import { Post } from 'src/modules/posts/entity/post.entity';
import { Comment } from 'src/modules/comments/entity/comment.entity';
import { UserDto } from './dto/userDto';


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


    checkOwn(userId,id,tmp):Promise<any>{
        return new Promise(async resolve=>{
            let result;
            if(tmp==='tag'){
                const t=await this.tagRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t==null) result= false
                else if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            else if(tmp=='post'){
                const t=await this.postRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t==null) result= false
                else if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            else if(tmp=='comment'){
                const t=await this.commentRepository.findOne({where:{id:Number(id)},relations:['createdUser']});
                if(t==null) result= false
                else if(t.createdUser.id==Number(userId))result=true;
                else result=false;
            }
            resolve(result);
        })
    }

    async findOne(email: string): Promise<any> {
        return await this.usersRepository.findOne({ where: { email: email } });
    }
    async create(user:any,hashPass){
       user.password=hashPass;
       await this.mailQueue.add('transcode', { mail: user.email });
        await this.usersRepository.save(user);
        return await this.findOne(user.email);
    }


    // saveUser(user: any): Promise<any> {
    //     return new Promise(async resolve => {
            
    //         var exist = await this.usersRepository.findOne({
    //             where: { email: `${user.email}` }
    //         });
    //         if (exist != null) resolve('exist')
    //         else {
                
    //             user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
                
    //             await this.mailQueue.add('transcode', { mail: user.email });
    //             console.log('mail');
    //             await this.usersRepository.save(user);
    //             const saveUser = await this.usersRepository.findOne({ where: { email: user.email } });
    //              resolve(saveUser);
    //         }

    //     })
    // };

    // forgotPassword(email:any):Promise<any>{
    //     return new Promise(async resolve=>{
    //         var u=await this.usersRepository.findOne({where:{email:email}});
    //         if(u==null) resolve('user not found')
    //         else{
    //             const pass = await bcrypt.genSalt();
    //             // resolve(`${email} ${salt}`);
    //             await this.mailQueue.add('mailForgotPass', { mail:email,pass:pass });
    //            // user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
    //             u.password=await bcrypt.hash(pass,await bcrypt.genSalt());
    //             console.log(u.password);
    //             await this.usersRepository.save(u);
    //             delete u.password;
    //             resolve(u);
    //         }
           
    //     })
    // }
  

}
