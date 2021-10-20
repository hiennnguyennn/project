import { Post } from "src/modules/posts/entity/post.entity";
import { User } from "src/modules/user/entity/user.entity";
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