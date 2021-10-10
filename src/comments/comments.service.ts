import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { User } from 'src/user/entity/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentsService {
    private postRepository=getRepository(Post);
    private userRepository=getRepository(User);
    constructor(
    @InjectRepository(Comment)
    private commentRepository:Repository<Comment>
    ){}

    CurrentUser(userId):Promise<any>{
        return new Promise(async resolve=>{
            resolve(await this.userRepository.findOne(Number(userId)));
        })
    }

    comment(postId,userId,comment):Promise<any>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            var p= await this.postRepository.findOne(postId);
            var u=await this.CurrentUser(userId);
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
    };

    editComment(commentId,comment):Promise<any>{
        commentId=Number(commentId);
        return new Promise(async resolve=>{
            await this.commentRepository.update(commentId,comment);
            resolve(await this.commentRepository.findOne(Number(commentId)));
        })
    }

    getComments(postId):Promise<any>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            let p=await this.postRepository.findOne(postId);
            let c:Comment[]=await this.commentRepository.query(`select c.*,u.id from comment c inner join user u on c.createdUserId=u.id where c.postId=${postId}`)
            resolve(c);
        })
    }
}
