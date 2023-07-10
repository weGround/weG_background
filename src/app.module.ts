import { Module } from '@nestjs/common';
import { BlogService } from './blog/blog.service';
import { BlogController } from './blog/blog.controller';
import { BlogFileRepository, BlogMongoRepository } from './blog/blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/blog.schema';
import { SignupService } from './signup/signup.service';
import { Signup, SignupSchema } from './signup/signup.schema'; // 새로운 Signup 스키마를 가져옴
import { SignupController } from './signup/signup.controller'; // Signup 컨트롤러를 가져옴
import { SignupFileRepository, SignupMongoRepository } from './signup/signup.repository'; // Signup 리포지토리를 가져옴
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserinfoController } from './userinfo/userinfo.controller';
import { UserinfoModule } from './userinfo/userinfo.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/blog'),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forRoot('mongodb://localhost:27017/signup'),
    MongooseModule.forFeature([{ name: Signup.name, schema: SignupSchema }]),
    UserinfoModule, // Signup 컬렉션을 등록
  ],
  controllers: [AppController, BlogController, SignupController, UserinfoController], // Signup 컨트롤러를 추가
  providers: [ AppService, 
    BlogService, BlogFileRepository, BlogMongoRepository, 
    SignupService, SignupFileRepository, SignupMongoRepository], // Signup 리포지토리를 추가
})
export class AppModule {}
