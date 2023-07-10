import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShareInfo } from './share.model';
import { ShareMongoRepository } from './share.repository';

@Injectable()
export class ShareService {
  constructor(
    private shareRepository: ShareMongoRepository,
    @InjectModel('Share') private readonly shareModel: Model<ShareInfo>,
  ) {}

  async getAllShares() {
    return await this.shareRepository.getAllShares();
  }

  async createShare(shareInfo: ShareInfo) {
    return await this.shareRepository.createShare(shareInfo);
  }

  async getShare(postId: number) {
    return await this.shareRepository.getShare(postId);
  }

  async deleteShare(postId: number) {
    return await this.shareRepository.deleteShare(postId);
  }

  async updateShare(postId: number, shareInfo: ShareInfo) {
    return await this.shareRepository.updateShare(postId, shareInfo);
  }
}
