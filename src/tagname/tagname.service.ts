import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { getRepository, Repository } from 'typeorm';
import { TagNameDto } from './DTO/tagname.dto';
import { TagName } from './entity/tagname.entity';

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
    CurrentUser(userId):Promise<any>{
        return new Promise(async resolve=>{
            resolve(await this.userRepository.findOne(Number(userId)));
        })
    }
    createTagname(tagname:TagNameDto,userId):Promise<any>{
        return new Promise(async resolve=>{
                let u=await this.CurrentUser(userId);
                let exist=await this.tagNameRepository.findOne({where:{tag:tagname.tag}});
                if(exist!=null) resolve('exist');
                else{
                   
                    let tmp:Object={
                        tag:tagname.tag,
                        createdUser:u
                    }
                    await this.tagNameRepository.save(tmp);
                    resolve(await this.tagNameRepository.findOne({where:{tag:tagname.tag}}));
                }
            
        })
    };
    editTagName(tagId,newName):Promise<any>{
        let id=Number(tagId);
        return new Promise(async resolve => {    
            let t:TagNameDto=Object(newName);

           if(t.tag[0]!=='#') t.tag='#'+t.tag;
               // let result=await this.tagNameRepository.findOne({relations:["createdUser"],where:{id:id}})
                //if(result==null) resolve('not exist tagname id')
                //else{
                        let tmp=await this.tagNameRepository.findOne({where:{tag:t.tag}});
                        if(tmp!=null){
                            resolve('tagname exist');
                        }
                        else{
                            await this.tagNameRepository.update({id},t);
                            resolve(this.tagNameRepository.findOne(id));
                        }                
               // }
            
           
        })
    }
}
