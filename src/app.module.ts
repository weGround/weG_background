import { Module } from '@nestjs/common';
import { HelloController } from './hello/hello.controller';
import { StudyService } from './study/study.service';
import { StudyModule } from './study/study.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [StudyModule],
  controllers: [AppController, HelloController],
  providers: [AppService, StudyService],
})
export class AppModule {}
