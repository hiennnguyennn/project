import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagName } from 'src/modules/tagname/entity/tagname.entity';
import { getRepository, Repository } from 'typeorm';
import { field } from '../../common/constants/enum/search.SortBy.enum';
import { sortTy } from '../../common/constants/enum/search.SortTy.enum';
import { PaginationDto } from './dto/pagination.dto';
import { SearchDto } from './dto/search.dto';
import { Post } from './entity/post.entity';
import { listPostInterface } from './interface/listPost.interface';
import { postInterface } from './interface/post.interface';

@Injectable()

export class PostsService {
    private tagRepository = getRepository(TagName);
    constructor(

        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ) { }
    private fs = require('fs');
   
    pagination(posts: postInterface[], page,limit): postInterface[] {
        return posts.slice(limit * (page - 1), limit * page);
    }
    transfer(post:any): postInterface {
        post.listTag=post.listTag.split(",");
        post.file=post.file.split(",");
        (post.listComments!=null)?post.listComments=post.listComments.split(","):post.listComments;
        for (var i = 0; i < post.file.length; i++) {
            post.file[i] = `src='localhost:3000/file/posts/${post.file[i]}'`;
        };
        let p: postInterface = {
            name: post.name,
            content: post.content,
            file: post.file,
            createUser: post.createdUser,
            createAt: post.createAt,
            tags: post.listTag,
            comments:post.listComments
        }
        return p;
    };
    transferListPost(posts:postInterface[],page,limit,totalCount):listPostInterface{
        let list:listPostInterface={
            posts:posts,
            limit:limit,
            page:page,
            totalCount:totalCount
        };
        return list;
    }
   
    
    savePost(post, file, user): Promise<postInterface> {

        file = (Object(file).file);
        return new Promise(async resolve => {
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
            let time = new Date().toString();
            const p: Object = {
                name: post.name,
                content: post.content,
                file: f,
                listTagname: t,
                createdUser: user,
                createAt: time
            };
            await this.postRepository.save(p);
            resolve(this.transfer(p));
        })
    }

    editPost(id, post, file): Promise<postInterface> {

        id = Number(id);

        return new Promise(async resolve => {
            file = (Object(file).file);
            post = Object(post);
            let tmp = await this.postRepository.findOne(id);
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
                tmp['listTagname'] = listTag;
            }
            await this.postRepository.save(tmp);
            resolve(this.transfer(await this.postRepository.findOne(id)));
        })
    }

    deletePost(id: number): Promise<string | postInterface[]> {
        id = Number(id);
        return new Promise(async resolve => {
            let u = await this.postRepository.findOne({id: id});
            let path;
            u.file.forEach((item, index) => {
                path = `./public/file/posts/${item}`;
                this.fs.unlinkSync(path);
            })
            await this.postRepository.delete(id);
            let result: postInterface[] = [];
            (await this.postRepository.find({ relations: ['createdUser', 'listTagname'] })).forEach((post, index) => {
                for (var i = 0; i < post.file.length; i++) {
                    post.file[i] = `src='localhost:3000/file/posts/${post.file[i]}'`;
                };
                result[index] = this.transfer(post);
            })
            resolve(result);
        })
    }

    getTopPost(pagination): Promise<listPostInterface> {
        return new Promise(async resolve => {
            let posts=await this.postRepository.query(`select p.id,p.name,p.content,p.file,p.createAt,u.name as createUser,group_concat(distinct t.tag) as listTag,group_concat(distinct concat("userId ",c.createdUserId,": ",c.content)) as listComments from post p left join comment c on p.id=c.postId left join user u on u.id=p.createdUserId left join post_list_tagname_tag_name tp on tp.postId=p.id left join tag_name t on t.id=tp.tagNameId group by p.id`)
            let result: postInterface[] = [];
            posts.forEach((post, index) => {            
                result[index] = this.transfer(post);
            })
            result.sort((b, a) =>
                new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
            )
            if (result.length > 10) result.splice(10);
            let totalCount=Math.ceil(result.length/pagination.limit);
            result = this.pagination(result, pagination.page,pagination.limit);
            
            resolve(this.transferListPost(result,pagination.page,pagination.limit,totalCount));
        })
    }

    // search(value,pagination): Promise<listPostInterface> {
        
    //     let v: string[] = value.split(",");
    //     return new Promise(async resolve => {
    //         var posts=await this.postRepository.query(`select p.id,p.name,p.content,p.file,p.createAt,u.name as createUser,group_concat(distinct t.tag) as listTag,group_concat(distinct concat("userId ",c.createdUserId,": ",c.content)) as listComments from post p left join comment c on p.id=c.postId left join user u on u.id=p.createdUserId left join post_list_tagname_tag_name tp on tp.postId=p.id left join tag_name t on t.id=tp.tagNameId group by p.id`)
    //         let result: postInterface[] = [];
    //         let name_tag: string[][] = [];
    //         posts.forEach((post,index) => {
    //            name_tag[index]=[];
    //             name_tag[index].push(post.name);
    //             name_tag[index]=name_tag[index].concat(post.listTag.split(","));
    //         });
    //         let checker = (arr, target) => target.every(v => arr.includes(v));
    //         name_tag.forEach(async (item, index) => {
    //             if (checker(item, v)){ result.push(this.transfer(posts[index]))}
    //         });
    //         let totalCount=Math.ceil(result.length/pagination.limit);
    //         result=this.pagination(result,pagination.page,pagination.limit);
    //         resolve(this.transferListPost(result,pagination.page,pagination.limit,totalCount))
    //     })
    // };

    search(data:SearchDto):Promise<listPostInterface>{
        return new Promise(async resolve=>{
            var posts=await this.postRepository.query(`select p.name,p.content,p.file,p.createAt,u.name as createUser,group_concat(distinct t.tag) as listTag,group_concat(distinct concat("userId ",c.createdUserId,": ",c.content)) as listComments from post p left join comment c on p.id=c.postId left join user u on u.id=p.createdUserId left join post_list_tagname_tag_name tp on tp.postId=p.id left join tag_name t on t.id=tp.tagNameId group by p.id`);
            
            let result: postInterface[] = [];
            if(data.value==null){
                posts.forEach((post,index) => {
                    result[index]=this.transfer(post)
                });
            }
            else{
                let v:string[]=data.value.split(" ");
                let name_tag: string[][] = [];
                posts.forEach((post,index) => {
                   name_tag[index]=[];
                    name_tag[index].push(post.name);
                    name_tag[index]=name_tag[index].concat(post.listTag.split(","));
                });
                let checker = (arr, target) => target.every(v => arr.includes(v));
                name_tag.forEach(async (item, index) => {
                    if (checker(item, v)){ result.push(this.transfer(posts[index]))}
                });
            };  
            if(!!data.fromDate){
                result=result.filter((post,index)=>{
                    return new Date(post.createAt)>data.fromDate;
                })
            };
            if(!!data.toDate){
                result=result.filter((post,index)=>{
                    return new Date(post.createAt)<data.toDate;
                })
            }  
            let sortBy:string=(String(data.sortBy)==="date"?'createAt':'name');
          result.sort((a, b) =>
            (String(data.sortTy)==="asc")?(a[sortBy]>b[sortBy]?1:-1):(b[sortBy]>a[sortBy]?1:-1)
            )
            let totalCount=Math.ceil(result.length/data.limit);
            result=this.pagination(result,data.page,data.limit);
            resolve(this.transferListPost(result,data.page,data.limit,totalCount))
        })
    }

}
