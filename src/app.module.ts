import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { BlogService  } from './blog/blog.service';
import {BlogController} from './blog/blog.controller';
import { BlogFileRepository, BlogMongoRepository } from './blog/blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/blog.schema';

@Module({
  imports: [ 
    MongooseModule.forRoot('mongodb://localhost:27017/blog'),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [ BlogController ],
  providers: [ BlogService, BlogFileRepository, BlogMongoRepository],
})
export class AppModule {}
