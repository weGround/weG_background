import { Module } from '@nestjs/common';
import { BlogService } from './blog/blog.service';
import { BlogController } from './blog/blog.controller';
import { BlogFileRepository, BlogMongoRepository } from './blog/blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/blog.schema';
import { SignupService } from './signup/signup.service';
import { Signup, SignupSchema } from './signup/signup.schema'; 
import { SignupController } from './signup/signup.controller'; 
import { SignupFileRepository, SignupMongoRepository } from './signup/signup.repository'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupService } from './group/group.service';
import { GroupController } from './group/group.controller';
import { GroupModule } from './group/group.module';
import { GroupFileRepository, GroupMongoRepository } from './group/group.repository'; 
import { Group, GroupSchema } from './group/group.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/blog'),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forRoot('mongodb://localhost:27017/signup'),
    MongooseModule.forFeature([{ name: Signup.name, schema: SignupSchema }]),
    MongooseModule.forRoot('mongodb://localhost:27017/group'),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    GroupModule,
     // Signup 컬렉션을 등록
  ],
  controllers: [AppController, BlogController, SignupController, GroupController], // Signup 컨트롤러를 추가
  providers: [ AppService, 
    BlogService, BlogFileRepository, BlogMongoRepository, 
    SignupService, SignupFileRepository, SignupMongoRepository, 
    GroupService, GroupFileRepository, GroupMongoRepository ], // Signup 리포지토리를 추가
})
export class AppModule {}
