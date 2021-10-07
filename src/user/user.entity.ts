
import { Comment } from "src/comments/comment.entity";
import { Post } from "src/posts/post.entity";
import { TagName } from "src/tagname/tagname.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @OneToMany(()=>TagName,tagname=>tagname.createdUser)
    listTagNames: TagName[]
    
    @OneToMany(()=>Post,post=>post.createdUser)
    listPosts:Post[]

    @OneToMany(()=>Comment,comment=>comment.createdUser)
    listComments:Comment[]
}