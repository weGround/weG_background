import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupInfo } from './group.model';
import { Model} from 'mongoose';
import { GroupMongoRepository } from './group.repository';


@Injectable()
export class GroupService {
    constructor(private groupRepository: GroupMongoRepository, @InjectModel('Group') private readonly groupModel: Model<GroupInfo>,) {}
    
    async getAllGruops() {
        return await this.groupRepository.getAllGroups();
    }

    async createGroup(groupInfo: GroupInfo): Promise<string> {
      const existingGroup = await this.groupModel
        .findOne({ groupname: groupInfo.groupname })
        .exec();
      if (existingGroup) {
        return 'Group already exists';
      }
      await this.groupModel.create(groupInfo);
      return 'Group created successfully';
    }
    
    async getGroup(groupname: string): Promise<GroupInfo | null> {
      return this.groupModel.findOne({ groupname }).exec();
    }
    
    async updateGroup(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo | null> {
      return this.groupModel.findOneAndUpdate({ groupname }, groupInfo, { new: true }).exec();
    }
    
    async deleteGroup(groupname: string): Promise<GroupInfo | null> {
      return this.groupModel.findOneAndDelete({ groupname }).exec();
    }
    async getMems(groupname: string): Promise<string[]> {
      const group = await this.getGroup(groupname);
      return group ? group.groupmembers : [];
    }

    async updateMems(groupname: string, groupmembers: string[]): Promise<GroupInfo | null> {
      return this.groupModel.findOneAndUpdate(
          { groupname },
          { groupmembers },
          { new: true }
      ).exec();
  }

  async getImg(groupname: string): Promise<string> {
    const group = await this.getGroup(groupname);
    return group ? group.groupimg : '';
  }

  async updateImg(groupname: string, groupimg: string): Promise<GroupInfo | null> {
      return this.groupModel.findOneAndUpdate(
          { groupname },
          { groupimg },
          { new: true }
      ).exec();
  }

  async updateInfo(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo | null> {
      return this.groupModel.findOneAndUpdate(
          { groupname },
          groupInfo,
          { new: true }
      ).exec();
  }
    
}



