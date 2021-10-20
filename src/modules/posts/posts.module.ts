import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { Post } from './entity/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports:[TypeOrmModule.forFeature([Post]),UserModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
