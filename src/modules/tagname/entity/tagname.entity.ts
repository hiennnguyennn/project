import { Post } from "src/modules/posts/entity/post.entity";
import { User } from "src/modules/user/entity/user.entity";
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