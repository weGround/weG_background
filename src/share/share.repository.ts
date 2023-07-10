import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShareInfo } from './share.model';
import {readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { Share, ShareDocument } from './share.schema';

export interface ShareRepository {
  getAllShares(): Promise<ShareInfo[]>;
  createShare(shareInfo: ShareInfo): Promise<ShareInfo>;
  getShare(postId: number): Promise<ShareInfo | null>;
  deleteShare(postId: number): Promise<void>;
  updateShare(postId: number, shareInfo: ShareInfo): Promise<ShareInfo>;
}

@Injectable()
export class ShareFileRepository implements ShareRepository {
  FILE_NAME = '/root/madcamp_back/weG_background/src/share/shareinfo.data.json';

  async getAllShares(): Promise<ShareInfo[]> {
    const datas = await readFile(this.FILE_NAME, 'utf8');
    const shares = JSON.parse(datas);
    return shares;
  }

  async createShare(shareInfo: ShareInfo): Promise<ShareInfo> {
    const shares = await this.getAllShares();
    shares.push(shareInfo);
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return shareInfo;
  }

  async getShare(postId: number): Promise<ShareInfo | null> {
    const shares = await this.getAllShares();
    const share = shares.find((share) => share.post_id === postId);
    return share || null;
  }

  async deleteShare(postId: number): Promise<void> {
    const shares = await this.getAllShares();
    const filteredShares = shares.filter((share) => share.post_id !== postId);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredShares));
  }

  async updateShare(postId: number, shareInfo: ShareInfo): Promise<ShareInfo> {
    const shares = await this.getAllShares();
    const index = shares.findIndex((share) => share.post_id === postId);
    shares[index] = shareInfo;
    await writeFile(this.FILE_NAME, JSON.stringify(shares));
    return shareInfo;
  }
}

@Injectable()
export class ShareMongoRepository implements ShareRepository {
  constructor(@InjectModel(Share.name) private shareModel: Model<ShareDocument>) {}

  async getAllShares(): Promise<ShareInfo[]> {
    return await this.shareModel.find().exec();
  }

  async createShare(shareInfo: ShareInfo): Promise<ShareInfo> {
    return await this.shareModel.create(shareInfo);
  }

  async getShare(postId: number): Promise<ShareInfo | null> {
    return await this.shareModel.findOne({ post_id: postId }).exec();
  }

  async deleteShare(postId: number): Promise<void> {
    await this.shareModel.findOneAndDelete({ post_id: postId }).exec();
  }

  async updateShare(postId: number, shareInfo: ShareInfo): Promise<ShareInfo> {
    return await this.shareModel.findOneAndUpdate({ post_id: postId }, shareInfo, { new: true }).exec();
  }
}
