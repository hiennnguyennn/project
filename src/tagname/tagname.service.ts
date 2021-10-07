import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path/posix';
import { User } from 'src/user/user.entity';
import { getRepository, Repository } from 'typeorm';
import { TagNameDto } from './tagname.dto';
import { TagName } from './tagname.entity';

@Injectable()
export class TagnameService {
    private userRepository=getRepository(User);
    constructor(
        @InjectRepository(TagName)
        private tagNameRepository:Repository<TagName>,
      
    ){}

    findAll():Promise<any>{
        return new Promise(resolve=>{
            resolve(this.tagNameRepository.find());
        })
    };

    createTagname(tagname:TagNameDto):Promise<any>{
        return new Promise(async resolve=>{
                
                let exist=await this.tagNameRepository.findOne({where:{tag:tagname.tag}});
                if(exist!=null) resolve('exist');
                else{
                   
                    let tmp:Object={
                        tag:tagname.tag,
                       // createdUser:u
                    }
                    await this.tagNameRepository.save(tmp);
                    resolve(this.tagNameRepository.findOne({where:{tag:tagname.tag}}));
                }
            
        })
    };
    editTagName(tagId,newName):Promise<any>{
        let id=Number(tagId);
        return new Promise(async resolve => {    
            let t:TagNameDto=Object(newName);

           if(t.tag[0]!=='#') t.tag='#'+t.tag;
                let result=await this.tagNameRepository.findOne({relations:["createdUser"],where:{id:id}})
                if(result==null) resolve('not exist tagname id')
                else{
                    
                   // if(JSON.stringify(u)!=JSON.stringify(result.createdUser)) resolve('you are not allow')
                   // else{
                        let tmp=await this.tagNameRepository.findOne({where:{tag:t.tag}});
                        if(tmp!=null){
                            resolve('tagname exist');
                        }
                        else{
                            await this.tagNameRepository.update({id},t);
                            resolve(this.tagNameRepository.findOne(id));
                        }
                   // }
                   
                   
                }
            
           
        })
    }
}
