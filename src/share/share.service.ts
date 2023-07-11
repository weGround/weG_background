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

  async postLike(postId: number, likeUser: string): Promise<ShareInfo | null> {
    const share = await this.getShare(postId);
    if (!share) {
      return null;
    }
    share.like_count += 1;
    share.like_users.push(likeUser);
    return await this.updateShare(postId, share);
  }
  async postComment(postId: number, commentInfo: { comment_id: number, comment_detail: string, comment_writer: string }) {
    return await this.shareRepository.postComment(postId, commentInfo);
  }
}
