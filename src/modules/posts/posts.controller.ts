import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {  ApiConsumes, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { Auth } from 'src/common/decorator/auth.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { PostDto } from './dto/post.dto';
import { PostEditDto } from './dto/post.edit.dto';
import { SearchDto } from './dto/search.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }


    @Get('1')
    
    async getAllPosts(@Query() a:PaginationDto) {
      console.log(a.page);
        return a;
    }

    @Auth('user')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], { dest: "./public/file/posts" }))
    @Post('')
    @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
    @ApiConsumes('multipart/form-data')
    async upload(@Req() Req,@Body() body: PostDto, @UploadedFiles() file: [Express.Multer.File]) {
        const result = await this.postsService.savePost(body, file,Req.user);
        return result;

    }


    @Auth('own')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], { dest: "./public/file/posts" }))
    @Patch(':postId')
    @ApiParam({name: 'postId', required: true, description: 'an integer for the post id', schema:{type:'integer'} })
    @ApiResponse({ status: 200, description: 'Edit successfully.' })
    @ApiResponse({ status: 403, description: 'You are not allowed.' })
  //  @ApiResponse({status:404,description:'PostId not found'})
    @ApiConsumes('multipart/form-data')
    async editPost(@Param('postId') postId,@Body() newPost: PostEditDto, @UploadedFiles() file: [Express.Multer.File]) {
        const result = await this.postsService.editPost(postId, newPost, file);
       // if(result=='not exist') throw new HttpException('PostID not found',404);
         return result;
    }

    @Auth('own')
    @Delete(':postId')
    @ApiParam({name: 'postId', required: true, description: 'an integer for the post id', schema:{type:'integer'} })
    @ApiResponse({ status: 200, description: 'Delete successfully.' })
    @ApiResponse({ status: 403, description: 'You are not allowed.' })
   // @ApiResponse({status:404,description:'PostId not found'})
    async deletePost(@Param('postId') postId) {
        const r=await this.postsService.deletePost(postId);
      //  if(r=='not exist') throw new HttpException('PostID not found',404)
         return r;
    }
   

    @Get('top10')
    @ApiResponse({ status: 200, description: 'Get top post successfully.' })
  //  @ApiResponse({status:404,description:'TagId not found'})
    async getTopPost(@Query() pagination:PaginationDto){
        const result=await this.postsService.getTopPost(pagination); 
         return result;
    }

    // @Get('search')
    // @ApiResponse({ status: 200, description: 'Search successfully' })
    // @ApiQuery({name:'value'})
    // @UsePipes(new ValidationPipe({ whitelist: true }))
    // async search(@Query('value') value, @Query() pagination:PaginationDto){
    //     const result=await this.postsService.search(value,pagination);
    //     return result;
    // }
    @Get('search')
    @ApiResponse({ status: 200, description: 'Search successfully' })
    @UsePipes(new ValidationPipe({transform:true,forbidUnknownValues:true }))
    async searchLocal(@Query() data:SearchDto){
        const result=await this.postsService.search(data);

        return data;
    }

   
}
