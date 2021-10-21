import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TagnameModule } from './modules/tagname/tagname.module';
import { PostsModule } from './modules/posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { DatabaseConfig } from './config/database.config';
import { configService } from './config/config';
require('dotenv').config();
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','public')
    }),
    ConfigModule.forRoot(
      {isGlobal:true,load:[configService]}
    ),
    BullModule.forRoot({
      redis:{
        host:'localhost',
        port:Number(process.env.REDIS_PORT)
      }
    }),
    
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: Number(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   entities: [User,TagName,Post,Comment],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({imports:[ConfigModule],useClass:DatabaseConfig}),
    
    UserModule,
    AuthModule,
    TagnameModule,
    PostsModule,
    CommentsModule,
    
    // JwtModule.register({
    //   secret:process.env.JWT_SECRET,
    //   signOptions:{expiresIn:'5s'}
    // }),   
    AuthModule, CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
