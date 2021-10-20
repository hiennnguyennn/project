import { Body, Controller, Get, HttpException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import {  ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { type } from 'os';
import { Auth } from 'src/common/decorator/auth.decorator';
import { TagNameDto } from './dto/tagname.dto';
import { TagnameService } from './tagname.service';

@Controller('tagnames')
export class TagnameController {
  constructor(private tagNameService: TagnameService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'get list tagname successfully' })
  async show() {
    const result = await this.tagNameService.findAll();
    return result;
  }


  @Auth('user')
  @Post()
  @ApiResponse({ status: 201, description: 'The tagname has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Tagname exist' })
  async handleCreateTagName(@Req() Req, @Body() tagname: TagNameDto) {
    const result = await this.tagNameService.createTagname(tagname, Req.user);
    //return result;
    if (result == 'exist') {
      throw new HttpException('Tagname exist', 409);
    }
    else return result;
  }


  @Auth('own')
  @Patch('/:tagId')
  @ApiParam({name: 'tagId', required: true, description: 'an integer for the tag id', schema:{type:'integer'} })
  @ApiResponse({ status: 200, description: 'Update successfully.' })
  @ApiResponse({ status: 403, description: 'You are not allowed.' })
  // @ApiResponse({status:404,description:'TagnameID not found'})
  @ApiResponse({ status: 409, description: 'Tagname exist' })
  async updateTagName(@Param('tagId') tagId,@Req() Req, @Body() tag: TagNameDto) {
    const result = await this.tagNameService.editTagName(tagId, tag);
    // if(result=='not exist tagname id'){
    //   throw new HttpException('TagnameID not found',404)
    // }
    if (result == 'tagname exist') {
      throw new HttpException('Tagname used', 409)
    }
    else return result;
  }
}
