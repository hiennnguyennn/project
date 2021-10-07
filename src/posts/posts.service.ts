import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagName } from 'src/tagname/tagname.entity';
import { User } from 'src/user/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()

export class PostsService {

    private userRepository = getRepository(User);
    private tagRepository = getRepository(TagName);
    constructor(

        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ) { }
    private fs = require('fs');

    pagination(posts:Post[],page){
        return posts.slice(3*(page-1),3*page);
    }

    getPost(page): Promise<any> {
        page=Number(page);
        return new Promise(async resolve => {
            var result:Post[] = await this.postRepository.find();
            result.forEach((post, index) => {
                for (var i = 0; i < post.file.length; i++) {
                    post.file[i] = `<html><img src='./file/posts/${post.file[i]}'></html>'`;
                }
            });
            result=this.pagination(result,page);
            resolve(result);
        })
    }

    savePost(post, file): Promise<any> {

        file = (Object(file).file);
        return new Promise(async resolve => {

            //let u = await this.userRepository.findOne(Number(post.createdUserId));

            let t: TagName[] = [];
            post.tag = post.tag.split(',');
            for (var i = 0; i < post.tag.length; i++) {
                let tmp = await this.tagRepository.findOne(Number(post.tag[i]));
                t.push(tmp);
            }

            let f: string[] = [];
            if (file != null) {
                file.forEach((item, index) => {
                    f.push(item.filename);
                });
            }

            const p: Object = {
                name: post.name,
                content: post.content,
                file: f,
                listTagname: t,
               // createdUser: c,
                createAt: new Date().toString(),
            };
            await this.postRepository.save(p);
            resolve(p);
            //  resolve(await this.postRepository.findOne({ where: { name: post.name } }));
        })
    }

    editPost(id, post, file): Promise<any> {

        id = Number(id);

        return new Promise(async resolve => {
            //let tmp: Object = {};
            file = (Object(file).file);
            post = Object(post);
            let tmp = await this.postRepository.findOne({ relations: ['createdUser'], where: { id: id } });
            if (tmp == null) resolve('not exist')
            else {
               // if (JSON.stringify(tmp.createdUser) != JSON.stringify(c)) resolve('you are not allow')
                //else {
                    if (file != null) {
                        let path: string;
                        tmp.file.forEach((item, index) => {
                            path = `./public/file/posts/${item}`;
                            this.fs.unlinkSync(path);
                        })
                        file.forEach((item, index) => {
                            file[index] = item.filename;
                        });
                        tmp['file'] = file;
                    }
                    if (post.name != '') tmp['name'] = post.name;
                    if (post.content != '') tmp['content'] = post.content;
                    if (post.tag != '') {

                        let listTag: TagName[] = [];
                        post.tag = post.tag.split(',');
                        for (var i = 0; i < post.tag.length; i++) {
                            let x = await this.tagRepository.findOne(Number(post.tag[i]));
                            listTag.push(x);
                        }
                        //   resolve(listTag);
                        tmp['listTagname'] = listTag;
                        //  resolve(tmp)
                    }
                    await this.postRepository.save(tmp);
                    resolve(await this.postRepository.findOne(id));
               // }

            }
        })
    }

    deletePost(id: number): Promise<any> {
        id = Number(id);
        return new Promise(async resolve => {
            // this.postRepository.findOne({relations:['createdUser'],where:{id:id}});
            let u = await this.postRepository.findOne({ relations: ['createdUser'], where: { id: id } });
            if (u == null) resolve('not exist')
            else {
               // if (JSON.stringify(u.createdUser) != JSON.stringify(c)) resolve('You are not allow')
                //else {
                    let path;
                    u.file.forEach((item, index) => {
                        path = `./public/file/posts/${item}`;
                        this.fs.unlinkSync(path);
                    })
                    await this.postRepository.delete(id);
                    resolve(await this.postRepository.find());
              //  }

            }
        })
    }

    getTopPost(page): Promise<any> {
        page=Number(page);
        return new Promise(async resolve => {

            // let p=await this.tagRepository.createQueryBuilder("tagname")
            //             .leftJoinAndSelect("tagname.posts","post")
            //             .getMany();
            //select c.*,u.id from comment c inner join user u on c.createdUserId=u.id where c.postId=${postId}
            //let posts = await this.postRepository.query(`select p.*,t.tag from post p, tag_name t, post_list_tagname_tag_name tp where p.id=tp.postId and t.id=tagNameId `)
            // let p= await this.tagRepository.findOne({relations:["posts"],where:{id:tag}});
            //  let posts=p["posts"];
            let posts: Post[] = await this.postRepository.find({ relations: ['listTagname'] });
            posts.sort((b, a) =>
                new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
            )
            if (posts.length > 10) posts.splice(10);
            posts=this.pagination(posts,page);
            resolve(posts);
            // resolve(tagName.posts);

        })
    }
    // checker:boolean = (arr, target) => target.every(v => arr.includes(v));

    check(arr, target): boolean {
        let checker: boolean = target.every(v => arr.includes(v));
        return checker;
    }
    search(value,page): Promise<any> {
        let v: string[] = value.split(" ");
        return new Promise(async resolve => {
            // const posts: Post[] = await this.postRepository.query(`select p.*,t.tag from post p, tag_name t, post_list_tagname_tag_name tp where p.id=tp.postId and t.id=tagNameId `)
            const posts: Post[] = await this.postRepository.find({ relations: ['listTagname'] });
            let result:Post[]=[];
            let name_tag: string[][] = [];
            posts.forEach((item) => {
                var t: string[] = [];
                t.push(item['name']);
                item['listTagname'].forEach(tag => {
                    t.push(tag['tag']);
                });
                name_tag.push(t);
            });
           // let checker = (arr, target) => target.every(v => arr.includes(v));
           let checker = (arr, target) => target.every(v => arr.includes(v));
            let ar_int:number[]=[];
            name_tag.forEach((item,index)=>{
                if(checker(item,v)) result.push(posts[index]);
            });
            result=this.pagination(result,page);
            resolve(result)
            

        })
    }
}
