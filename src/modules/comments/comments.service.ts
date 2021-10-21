import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/modules/posts/entity/post.entity';
import { getRepository, Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { commentInterface } from './interface/comment.interface';

@Injectable()
export class CommentsService {
    private postRepository=getRepository(Post);
    constructor(
    @InjectRepository(Comment)
    private commentRepository:Repository<Comment>
    ){}

   transfer(comment):commentInterface{
    let tmp:commentInterface={content:comment["content"],
               createdAt:comment["createdAt"],
               createdUser:comment["createdUser"].name,
               postId:comment["post"].id};             
         return (tmp)
}
    comment(postId,user,comment):Promise<string|commentInterface>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            var p= await this.postRepository.findOne(postId);
            if(p==null) resolve('not exist')
            else{
                comment=Object(comment);
                comment['post']=p;
                var time=new Date().toString();
                comment['createdAt']=time;
                comment['createdUser']=user;
             await this.commentRepository.save(comment);
               let tmp:commentInterface=this.transfer(comment) 
               resolve(tmp)
            }
        })
    };

    editComment(commentId,comment):Promise<commentInterface>{
        commentId=Number(commentId);
        return new Promise(async resolve=>{
            await this.commentRepository.update(commentId,comment);
           let x=this.transfer(await this.commentRepository.findOne({where:{id:commentId},relations:['createdUser','post']}));
           resolve(x);
        })
    }

    getComments(postId):Promise<commentInterface[]>{
        postId=Number(postId);
        return new Promise(async resolve=>{
            let p=await this.postRepository.findOne(postId);
            let c=await this.commentRepository.createQueryBuilder("Comment").innerJoinAndSelect("Comment.post","post").leftJoinAndSelect("Comment.createdUser","user").where(`Comment.post.id=${postId}`).getMany()
            let x:commentInterface[]=[];
            await c.forEach((item,index)=>{
                x[index]=this.transfer(item);

            })
            resolve(x);
        })
    }
}
