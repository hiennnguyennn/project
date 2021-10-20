import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';
import { Auth } from 'src/common/decorator/auth.decorator';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService:CommentsService){}

    @Auth('user')
    @Post()
    @ApiResponse({ status: 201, description: 'Comment successfully' })
    @ApiQuery({name:'postId'})
    async comment(@Req() req,@Query('postId') postId,@Body() commenDto:CommentDto){
        const result=await this.commentsService.comment(postId,req.user,commenDto);
        return result;
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Get list comments successfully' })
    @ApiQuery({name:'postId'})
    async listComments(@Query('postId') postId){
        const result=await this.commentsService.getComments(postId);
        return result;
    }

    @Auth('own')
    @Patch(':commentId')
    @ApiParam({name: 'commentId', required: true, description: 'an integer for the post id', schema:{type:'integer'} })
    @ApiResponse({status:200,description:'Edit successfully'})
    @ApiResponse({ status: 403, description: 'You are not allowed.' })
    async editComment(@Param('commentId') commentId,@Body() comment:CommentDto ){
        const result=await this.commentsService.editComment(commentId,comment);
        return result;
    }


}
