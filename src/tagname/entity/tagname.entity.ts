import { Post } from "src/posts/entity/post.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagName{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column()
    tag:string;

    @ManyToOne(()=>User,user=>user.listTagNames)
    createdUser:User;

    @ManyToMany(()=>Post,post=>post.listTagname)
    posts:Post[];
   
}