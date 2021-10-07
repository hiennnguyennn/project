import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { throwIfEmpty } from 'rxjs';
import { CommentDto } from './comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService:CommentsService){}


    @Post()
    @ApiQuery({name:'postId'})
    @ApiQuery({name:'userId'})
    async comment(@Query('postId') postId,@Query('userId') userId,@Body() commenDto:CommentDto){
        const result=await this.commentsService.comment(postId,userId,commenDto);
        return result;
    }

    @Get('list')
    @ApiQuery({name:'postId'})
    async listComments(@Query('postId') postId){
        const result=await this.commentsService.getComments(postId);
        return result;
    }
}
