import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Comment]),UserModule],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
