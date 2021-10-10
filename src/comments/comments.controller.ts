import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CommentDto } from './DTO/comment.dto';
import { CommentsService } from './comments.service';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService:CommentsService){}

    @Auth('user')
    @Post()
    @ApiResponse({ status: 201, description: 'Comment successfully' })
    @ApiQuery({name:'postId'})
    async comment(@Req() req,@Query('postId') postId,@Body() commenDto:CommentDto){
        const result=await this.commentsService.comment(postId,req.user.id,commenDto);
        return result;
    }

    @Get('list')
    @ApiResponse({ status: 200, description: 'Get list comments successfully' })
    @ApiQuery({name:'postId'})
    async listComments(@Query('postId') postId){
        const result=await this.commentsService.getComments(postId);
        return result;
    }

    @Auth('own')
    @Patch('edit')
    @ApiResponse({status:200,description:'Edit successfully'})
    @ApiResponse({ status: 403, description: 'You are not allowed.' })
    @ApiQuery({name:'commentId'})
    async editComment(@Query('commentId') commentId,@Body() comment:CommentDto ){
        const result=await this.commentsService.editComment(commentId,comment);
        return result;
    }


}
