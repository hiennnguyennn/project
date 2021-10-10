import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {  ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { PostDto } from './DTO/post.dto';
import { PostEditDto } from './DTO/post.edit.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    @ApiQuery({name:'page'})
    async getAllPosts(@Query('page') page) {
        const result = await this.postsService.getPost(page);
        return result;
    }

    @Auth('user')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], { dest: "./public/file/posts" }))
    @Post('create')
    @ApiResponse({ status: 201, description: 'The tagname has been successfully created.' })
    @ApiConsumes('multipart/form-data')
    async upload(@Req() Req,@Body() body: PostDto, @UploadedFiles() file: [Express.Multer.File]) {
        const result = await this.postsService.savePost(body, file,Req.user.id);
        return result;

    }


    @Auth('own')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], { dest: "./public/file/posts" }))
    @Patch('edit')
    @ApiResponse({ status: 200, description: 'Edit successfully.' })
  //  @ApiResponse({status:404,description:'PostId not found'})
    @ApiConsumes('multipart/form-data')
    @ApiQuery({ name: 'postId' })
    async editPost(@Query('postId') postId, @Body() newPost: PostEditDto, @UploadedFiles() file: [Express.Multer.File]) {
        const result = await this.postsService.editPost(postId, newPost, file);
       // if(result=='not exist') throw new HttpException('PostID not found',404);
         return result;
    }

    @Auth('own')
    @Delete('delete')
    @ApiResponse({ status: 200, description: 'Delete successfully.' })
    @ApiResponse({status:404,description:'PostId not found'})
    @ApiQuery({name:'postId'})
    async deletePost(@Query('postId') id) {
        const r=await this.postsService.deletePost(id);
      //  if(r=='not exist') throw new HttpException('PostID not found',404)
         return r;
    }
   

    @Get('top')
    @ApiQuery({name:'page'})
    @ApiResponse({ status: 200, description: 'Get top TagName successfully.' })
    @ApiResponse({status:404,description:'TagId not found'})
    async getTopPost(@Query('page') page){
        const result=await this.postsService.getTopPost(page);
       
         return result;
    }

    @Get('search')
    @ApiQuery({name:'value'})
    @ApiQuery({name:'page'})
    async search(@Query('value') value, @Query('page') page){
        const result=await this.postsService.search(value,page);
        return result;
    }

    // @Get('top')
    // @ApiResponse({ status: 200, description: 'Get top TagName successfully.' })
    // @ApiResponse({status:404,description:'TagId not found'})
    // @ApiQuery({name:'tagId'})
    // async getTopPost(@Query('tagId') tagId){
    //     const result=await this.postsService.getTopPost(tagId);
    //     if(result=='not exist') throw new HttpException('TagID not found',404)
    //     else return result;
    // }
}
