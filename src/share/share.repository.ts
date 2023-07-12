import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShareInfo } from './share.model';
import {readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { Share, ShareDocument } from './share.schema';
import { v4 as uuidv4 } from 'uuid';

export interface ShareRepository {
  getAllShares(): Promise<ShareInfo[]>;
  createShare(shareInfo: ShareInfo): Promise<ShareInfo>;
  getShare(_id: string): Promise<ShareInfo | null>;
  deleteShare(_id: string): Promise<void>;
  updateShare(_id: string, shareInfo: ShareInfo): Promise<ShareInfo>;
  postComment(_id: string, commentInfo: { comment_detail: string, comment_writer: string }): Promise<ShareInfo> 
  getAllGroupShares(groupname: string): Promise<ShareInfo[]>
}

@Injectable()
export class ShareFileRepository implements ShareRepository {
  FILE_NAME = '/root/madcamp_back/weG_background/src/share/shareinfo.data.json';

  async getAllShares(): Promise<ShareInfo[]> {
    const datas = await readFile(this.FILE_NAME, 'utf8');
    const shares = JSON.parse(datas);
    return shares;
  }

  async getAllGroupShares(groupname: string): Promise<ShareInfo[]> {
    const shares = await this.getAllShares();
    const filteredShares = shares.filter((share) => share.post_group === groupname);
    return filteredShares;
  }

  async createShare(shareInfo: ShareInfo): Promise<ShareInfo> {
    const shares = await this.getAllShares();
    
    const newShare: ShareInfo = {
      _id: uuidv4(), // UUID 형태의 랜덤한 문자열로 설정
      ...shareInfo
    };

    shares.push(newShare);
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return newShare;
  }

  async getShare(_id: string): Promise<ShareInfo | null> {
    const shares = await this.getAllShares();
    const share = shares.find((share) => share._id === _id);
    return share || null;
  }

  async deleteShare(_id: string): Promise<void> {
    const shares = await this.getAllShares();
    const filteredShares = shares.filter((share) => share._id !== _id);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredShares));
  }

  async updateShare(_id: string, shareInfo: ShareInfo): Promise<ShareInfo> {
    const shares = await this.getAllShares();
    const index = shares.findIndex((share) => share._id === _id);
    shares[index] = shareInfo;
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return shareInfo;
  }
  async postLike(_id: string, likeUser: string): Promise<ShareInfo | null> {
    const shares = await this.getAllShares();
    const share = shares.find((share) => share._id === _id);
    if (!share) {
      return null;
    }
    share.like_count += 1;
    share.like_users.push(likeUser);
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return share;
  }
  async postComment(_id: string, commentInfo: { comment_id: number,comment_detail: string, comment_writer: string }): Promise<ShareInfo> {
    const shares = await this.getAllShares();
    const shareIndex = shares.findIndex((share) => share._id === _id);
    if (shareIndex === -1) {
      throw new Error('Share not found');
    }
    shares[shareIndex].comments.push(commentInfo);
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return shares[shareIndex];
  }
}

@Injectable()
export class ShareMongoRepository implements ShareRepository {
  constructor(@InjectModel(Share.name) private shareModel: Model<ShareDocument>) {}

  async getAllShares(): Promise<ShareInfo[]> {
    return await this.shareModel.find().exec();
  }
  
  async getAllGroupShares(groupname: string): Promise<ShareInfo[]> {
    return await this.shareModel.find({ post_group: groupname }).exec();
  }

  async createShare(shareInfo: ShareInfo): Promise<ShareInfo> {
    const createdShare = await this.shareModel.create(shareInfo);
    return createdShare.toObject();
  }

  async getShare(_id: string): Promise<ShareInfo | null> {
    return await this.shareModel.findOne({ _id }).exec();
  }

  async deleteShare(_id: string): Promise<void> {
    await this.shareModel.findOneAndDelete({ _id }).exec();
  }

  async updateShare(_id: string, shareInfo: ShareInfo): Promise<ShareInfo> {
    return await this.shareModel.findOneAndUpdate({ _id }, shareInfo, { new: true }).exec();
  }
  
  async postLike(_id: string, likeUser: string): Promise<ShareInfo | null> {
    const share = await this.shareModel.findOne({ _id }).exec();
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
  
    return await this.shareModel.findOneAndUpdate({ _id }, share, { new: true }).exec();
  }
  
  async postComment(_id: string, commentInfo: { comment_id: number, comment_detail: string, comment_writer: string }): Promise<ShareInfo> {
    const share = await this.getShare(_id);
    if (!share) {
      throw new Error('Share not found');
    }
    share.comments.push(commentInfo);
    await this.updateShare(_id, share);
    return share;
  }

  // async getShare(postId: number): Promise<ShareInfo | null> {
  //   return await this.shareModel.findOne({ post_id: postId }).exec();
  // }

  // async deleteShare(postId: number): Promise<void> {
  //   await this.shareModel.findOneAndDelete({ post_id: postId }).exec();
  // }

  // async updateShare(postId: number, shareInfo: ShareInfo): Promise<ShareInfo> {
  //   return await this.shareModel.findOneAndUpdate({ post_id: postId }, shareInfo, { new: true }).exec();
  // }
  // async postLike(postId: number, likeUser: string): Promise<ShareInfo | null> {
  //   const share = await this.shareModel.findOne({ post_id: postId }).exec();
  //   if (!share) {
  //     return null;
  //   }
  
  //   const userIndex = share.like_users.findIndex((user) => user === likeUser);
  //   if (userIndex !== -1) {
  //     share.like_count -= 1;
  //     share.like_users.splice(userIndex, 1);
  //   } else {
  //     share.like_count += 1;
  //     share.like_users.push(likeUser);
  //   }
  
  //   return await this.shareModel.findOneAndUpdate({ post_id: postId }, share, { new: true }).exec();
  // }
  // async postComment(postId: number, commentInfo: { comment_id: number, comment_detail: string, comment_writer: string }): Promise<ShareInfo> {
  //   const share = await this.getShare(postId);
  //   if (!share) {
  //     throw new Error('Share not found');
  //   }
  //   share.comments.push(commentInfo);
  //   await this.updateShare(postId, share);
  //   return share;
  // }
}
