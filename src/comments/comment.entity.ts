import { ConflictException } from "@nestjs/common";
import { Post } from "src/posts/post.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column()
    content:string;

    @Column()
    createdAt:string;

    @ManyToOne(()=>User,user=>user.listComments)
    createdUser:User;

    @ManyToOne(()=>Post,post=>post.listComments)
    post:Post;
}