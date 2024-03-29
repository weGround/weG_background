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

  async getAllGroupShares(groupname: string) {
    return await this.shareRepository.getAllGroupShares(groupname);
  }

  async createShare(shareInfo: ShareInfo): Promise<ShareInfo> {
    const createdShare = await this.shareRepository.createShare(shareInfo);
    return createdShare;
  }

  async getShare(_id: string) {
    return await this.shareRepository.getShare(_id);
  }

  async deleteShare(_id: string) {
    return await this.shareRepository.deleteShare(_id);
  }

  async updateShare(_id: string, shareInfo: ShareInfo) {
    return await this.shareRepository.updateShare(_id, shareInfo);
  }


  async postLike(_id: string, likeUser: string): Promise<ShareInfo | null> {
    const share = await this.getShare(_id);
    if (!share) {
      return null;
    }
  
    const userIndex = share.like_users.findIndex((user) => user === likeUser);
    if (userIndex !== -1) {
      share.like_count -= 1;
      share.like_users.splice(userIndex, 1);
    } else {
      share.like_count += 1;
      share.like_users.push(likeUser);
    }
  
    return await this.updateShare(_id, share);
  }

  async postComment(_id: string, commentInfo: { comment_detail: string, comment_writer: string }) {
    return await this.shareRepository.postComment(_id, commentInfo);
  }

  
  // async postComment(_id: string, commentInfo: { comment_id: number, comment_detail: string, comment_writer: string }) {
  //   return await this.shareRepository.postComment(_id, commentInfo);
  // }
}
