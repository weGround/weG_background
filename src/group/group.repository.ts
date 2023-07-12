import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupInfo } from './group.model';
import {readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from './group.schema';
import { write } from 'fs';


export interface GroupRepository {
  getAllGroups(): Promise<GroupInfo[]>;
  createGroup(groupInfo: GroupInfo): Promise<GroupInfo>;
  getGroup(groupname: string): Promise<GroupInfo | null>;
  deleteGroup(groupname: string): Promise<void>;
  updateGroup(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo>;
  getMems(groupname: string): Promise<string[]>;
  updateMems(groupname: string, newmember: string): Promise<GroupInfo>;
  deleteMems(groupname: string, deletemember: string): Promise<GroupInfo>;
  updateImg(groupname: string, groupimg: string): Promise<GroupInfo>;
  getInfo(groupname: string): Promise<string> 
  updateInfo(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo>;
  getImg(groupname: string): Promise<string>
}


@Injectable()
export class GroupFileRepository implements GroupRepository {
  FILE_NAME = '/root/madcamp_back/weG_background/src/group/groupinfo.data.json';

  async getAllGroups(): Promise<GroupInfo []> {
    const datas = await readFile(this.FILE_NAME, 'utf8');
    const groups = JSON.parse(datas);
    return groups;
  }

  async createGroup(groupInfo: GroupInfo): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    groups.push(groupInfo);
    await writeFile(this.FILE_NAME, JSON.stringify(groups));
    return groupInfo;
  }

  async getGroup(groupname: string): Promise<GroupInfo | null> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    return group || null;
  }

  async deleteGroup(groupname: string): Promise<void> {
    const groups = await this.getAllGroups();
    const filteredGroups = groups.filter((group) => group.groupname !== groupname);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredGroups));
  }

  async updateGroup(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    const index = groups.findIndex((group) => group.groupname === groupname);
    groups[index] = groupInfo;
    await writeFile(this.FILE_NAME, JSON.stringify(groups));
    return groupInfo;
  }
  async getMems(groupname: string): Promise<string[]> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    return group ? group.groupmembers : [];
  }


  async updateMems(groupname: string, newmember: string): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    if (group) {
      group.groupmembers.push(newmember);
      await writeFile(this.FILE_NAME, JSON.stringify(groups));
      return group;
    } else {
      throw new Error('Group not found');
    }
  }

  async deleteMems(groupname: string, deletemember: string): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    if (group) {
      const index = group.groupmembers.indexOf(deletemember);
      if (index !== -1) {
        group.groupmembers.splice(index, 1);
        await writeFile(this.FILE_NAME, JSON.stringify(groups));
        return group;
      } else {
        throw new Error('Member not found in the group');
      }
    } else {
      throw new Error('Group not found');
    }
  }

  async getImg(groupname: string): Promise<string> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    return group ? group.groupimg : '';
  }

  async getInfo(groupname: string): Promise<string> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    return group ? group.groupinfo : '';
  }

  async updateImg(groupname: string, groupimg: string): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    if (group) {
      group.groupimg = groupimg;
      await writeFile(this.FILE_NAME, JSON.stringify(groups));
      return group;
    } else {
      throw new Error('Group not found');
    }
  }

  async updateInfo(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo> {
    const groups = await this.getAllGroups();
    const group = groups.find((group) => group.groupname === groupname);
    if (group) {
      Object.assign(group, groupInfo);
      await writeFile(this.FILE_NAME, JSON.stringify(groups));
      return group;
    } else {
      throw new Error('Group not found');
    }
  }
}

@Injectable()
export class GroupMongoRepository implements GroupRepository {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>) {}

  async getAllGroups(): Promise<GroupInfo[]> {
    return await this.groupModel.find().exec();
  }

  async createGroup(groupInfo: GroupInfo): Promise<GroupInfo> {
    return await this.groupModel.create(groupInfo);
  }

  async getGroup(groupname: string): Promise<GroupInfo | null> {
    return await this.groupModel.findOne({ groupname }).exec();
  }

  async deleteGroup(groupname: string): Promise<void> {
    await this.groupModel.findOneAndDelete({ groupname }).exec();
  }

  async updateGroup(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo> {
    return await this.groupModel.findOneAndUpdate({ groupname }, groupInfo, { new: true }).exec();
  }
  async getMems(groupname: string): Promise<string[]> {
    const group = await this.groupModel.findOne({ groupname }).exec();
    return group ? group.groupmembers : [];
  }


  async updateMems(groupname: string, newmember: string): Promise<GroupInfo> {
    const group = await this.groupModel.findOne({ groupname }).exec();
    if (group) {
      group.groupmembers.push(newmember);
      return await group.save();
    } else {
      throw new Error('Group not found');
    }
  }

  async deleteMems(groupname: string, deletemember: string): Promise<GroupInfo> {
    const group = await this.groupModel.findOne({ groupname }).exec();
    if (group) {
      const index = group.groupmembers.indexOf(deletemember);
      if (index !== -1) {
        group.groupmembers.splice(index, 1);
        return await group.save();
      } else {
        throw new Error('Member not found in the group');
      }
    } else {
      throw new Error('Group not found');
    }
  }

  
  async getImg(groupname: string): Promise<string> {
    const group = await this.groupModel.findOne({ groupname }).exec();
    return group ? group.groupimg : '';
  }

  async updateImg(groupname: string, groupimg: string): Promise<GroupInfo> {
    return await this.groupModel.findOneAndUpdate(
      { groupname },
      { groupimg },
      { new: true }
    ).exec();
  }

  async getInfo(groupname: string): Promise<string> {
    const group = await this.groupModel.findOne({ groupname }).exec();
    return group ? group.groupinfo : '';
  }

  async updateInfo(groupname: string, groupInfo: GroupInfo): Promise<GroupInfo> {
    return await this.groupModel.findOneAndUpdate(
      { groupname },
      groupInfo,
      { new: true }
    ).exec();
  }
}