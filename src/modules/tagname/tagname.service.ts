import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { getRepository, Repository } from 'typeorm';
import { TagNameDto } from './dto/tagname.dto';
import { TagName } from './entity/tagname.entity';
import { tagnameInterface } from './interface/tagname.interface';

@Injectable()
export class TagnameService {
    private userRepository=getRepository(User);
    constructor(
        @InjectRepository(TagName)
        private tagNameRepository:Repository<TagName>,     
    ){}
        transfer(tag):tagnameInterface{
            let tagname:tagnameInterface={tag:tag.tag}
            return tagname;
        }
    findAll():Promise<tagnameInterface[]>{
        return new Promise(async resolve=>{
           let result:tagnameInterface[]=[];
           (await this.tagNameRepository.find()).forEach((tag,index)=>{
                result[index]=this.transfer(tag);
           });
           resolve(result);
        })
    };
    // CurrentUser(userId):Promise<any>{
    //     return new Promise(async resolve=>{
    //         resolve(await this.userRepository.findOne(Number(userId)));
    //     })
    // }
    createTagname(tagname:TagNameDto,user):Promise<string|tagnameInterface>{
        return new Promise(async resolve=>{
               // let u=await this.CurrentUser(userId);
                let exist=await this.tagNameRepository.findOne({where:{tag:tagname.tag}});
                if(exist!=null) resolve('exist');
                else{                  
                    let tmp:Object={
                        tag:tagname.tag,
                        createdUser:user
                    }
                    await this.tagNameRepository.save(tmp);
                    resolve(this.transfer(tmp));
                }
            
        })
    };
    editTagName(tagId,newName):Promise<string|tagnameInterface>{
        let id=Number(tagId);
        return new Promise(async resolve => {    
            let t:TagNameDto=Object(newName);
           if(t.tag[0]!=='#') t.tag='#'+t.tag;
                        let tmp=await this.tagNameRepository.findOne({where:{tag:t.tag}});
                        if(tmp!=null){
                            resolve('tagname exist');
                        }
                        else{
                            await this.tagNameRepository.update({id},t);
                            resolve(this.transfer(t))
                        }                        
           
        })
    }
}
