import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { BlogService  } from './blog/blog.service';
import {BlogController} from './blog/blog.controller';
import { BlogFileRepository } from './blog/blog.repository';

@Module({
  imports: [ BlogModule ],
  controllers: [AppController, BlogController],
  providers: [AppService, BlogService, BlogFileRepository],
})
export class AppModule {}
