import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Share, ShareSchema } from './share.schema';
import { ShareMongoRepository } from './share.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Share.name, schema: ShareSchema}])],
  providers: [ShareService, ShareMongoRepository]
})
export class ShareModule {}
