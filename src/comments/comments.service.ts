import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwIfEmpty } from 'rxjs';
import { Post } from 'src/posts/post.entity';
import { User } from 'src/user/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
    private postRepository=getRepository(Post);
    private userRepository=getRepository(User);
    constructor(
    @InjectRepository(Comment)
    private commentRepository:Repository<Comment>
    ){}

    comment(postId,userId,comment):Promise<any>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            var p= await this.postRepository.findOne(postId);
            var u=await this.userRepository.findOne(Number(userId));
            if(p==null) resolve('not exist')
            else{
                comment=Object(comment);
                comment['post']=p;
                var time=new Date().toString();
                comment['createdAt']=time;
                comment['createdUser']=u;
                await this.commentRepository.save(comment);
              resolve(this.commentRepository.findOne({where:{createdUser:u,createdAt:time}}))
            }
        })
    }

    getComments(postId):Promise<any>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            let p=await this.postRepository.findOne(postId);
            let c:Comment[]=await this.commentRepository.query(`select c.*,u.id from comment c inner join user u on c.createdUserId=u.id where c.postId=${postId}`)
           // let c:Comment[]=await this.commentRepository.find({relations:["post"],where:{post:p}});
            resolve(c);
        })
    }
}
