import { Comment } from "src/modules/comments/entity/comment.entity";
import { TagName } from "src/modules/tagname/entity/tagname.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column()
    name:string;

    @Column()
    content:string;

    @Column('simple-array')
    file:string[];

    @ManyToMany(() => TagName,tagname=>tagname.posts)
    @JoinTable()
    listTagname:TagName[];

    @ManyToOne(()=>User,user=>user.listPosts)
    createdUser:User

    @Column()
    createAt:string;

    @OneToMany(()=>Comment,comment=>comment.post)
    listComments:Comment[]

}