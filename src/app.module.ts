import { BullModule } from '@nestjs/bull';
import { Module, Post } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity'
import { TagName } from './tagname/tagname.entity';
import { UserModule } from './user/user.module';
import { TagnameModule } from './tagname/tagname.module';
import { PostsModule } from './posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/comment.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','public')
    }),
    ConfigModule.forRoot(
      {isGlobal:true,}
    ),
    BullModule.forRoot({
      redis:{
        host:'localhost',
        port:Number(process.env.REDIS_PORT)
      }
    }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [User,TagName,Post,Comment],
      synchronize: true,
    }),
    
    UserModule,
    
    TagnameModule,
    PostsModule,
    CommentsModule,
    
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'5s'}
    }),   
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }