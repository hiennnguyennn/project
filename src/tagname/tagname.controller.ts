import { Body, Controller, Get, HttpException, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { threadId } from 'worker_threads';
import { TagNameDto } from './tagname.dto';
import { TagnameService } from './tagname.service';

@Controller('tagname')
export class TagnameController {
    constructor(private tagNameService:TagnameService){}

    @Get()
    @ApiResponse({ status: 200, description: 'The list of tagname.' })
    async show(){
        const result=await this.tagNameService.findAll();
        return result;
    }

    @Post('create')
    @ApiResponse({ status: 201, description: 'The tagname has been successfully created.' })
    @ApiResponse({status:409,description:'Tagname exist'})
    //@ApiBody({type:TagNameDto})
    async handleCreateTagName(@Body() tagname:TagNameDto){
     
        const result=await this.tagNameService.createTagname(tagname);
        //return result;
        if(result=='exist'){
            throw new HttpException('Tagname exist',409);
        }
        else return result;
    }
    
    @Patch('update')
    @ApiResponse({ status: 200, description: 'Update successfully.' })
    @ApiResponse({status:404,description:'TagnameID not found'})
    @ApiResponse({ status: 409, description: 'Tagname used' })
    @ApiQuery({name:'tagId'})
    async updateTagName(@Query('tagId') tagId,@Body() tag:TagNameDto){
      // return newName;
        const result=await this.tagNameService.editTagName(tagId,tag);
        //return result;
      if(result=='not exist tagname id'){
        throw new HttpException('TagnameID not found',404)
      }
      else if(result=='tagname exist'){
          //throw HttpException(404);
        throw new HttpException('Tagname used',409)
      }
      else return result;
    }
}
