import { InjectModel } from '@nestjs/mongoose';
import { Model, TypeExpressionOperatorReturningObjectId } from 'mongoose';
import { Signup, SignupDocument } from './signup.schema';
import { Injectable } from '@nestjs/common';
import {readFile, writeFile } from 'fs/promises';
import {UserInfo, MyGroupProfile} from './signup.model';
import { userInfo } from 'os';

export interface SignupRepository {
    getAllUsers(): Promise<UserInfo[]>;
    createUser(userInfo: UserInfo);
    getUser(userid: String);
    deleteUser(userid: String);
    updateUser(userid: String, userInfo: UserInfo);
    validateUser(userid: string, pw: string);
    joinGroup(userid: string, groupname: string): Promise<UserInfo>;
    exitGroup(userid: string, groupname: string): Promise<UserInfo>;
    getUserMyGroupProfiles(userid: string, groupname: string): Promise<MyGroupProfile | null>;
    editUserMyGroupProfiles(
      userid: string,
      groupname: string,
      mygroup_nickname: string,
      mygroup_img: string,
      mygroup_detail: string
    ): Promise<MyGroupProfile | null>;
  }

@Injectable()
export class SignupFileRepository implements SignupRepository {
  FILE_NAME = '/root/madcamp_back/weG_background/src/signup/userinfo.data.json';

  async getAllUsers(): Promise<UserInfo[]> {
      const datas = await readFile(this.FILE_NAME, 'utf8');
      const users = JSON.parse(datas);
      return users;
  }

  async createUser(userInfo: UserInfo) {
      const users = await this.getAllUsers();
      const userid = users.length + 1;
      const createUser = { userid: userid.toString(), ...userInfo };
      users.push(createUser);
      await writeFile(this.FILE_NAME, JSON.stringify(users));

  }
  async getUser(userid: String) {
      const users = await this.getAllUsers();
      const result = users.find((user) => user.userid === userid);
      return result;
  }
  async deleteUser(userid: String) {
      const users = await this.getAllUsers();
      const filteredPosts = users.filter((user) => user.userid !== userid);
      await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
  }
  async updateUser(userid: String, userInfo: UserInfo) {
      const users = await this.getAllUsers();
      const index = users.findIndex((user) => user.userid === userid);
      const updatePost = {userid, ...userInfo };
      users[index] = updatePost;
      await writeFile(this.FILE_NAME, JSON.stringify(users));
  }
  async validateUser(userid: string, pw: string) {
      const users = await this.getAllUsers();
      const result = users.find((user) => user.userid === userid);
      if(!result) return null;
      if(result.pw === pw){
          return result;
      }
      return null;
  }

  async joinGroup(userid: string, groupname: string): Promise<UserInfo> {
      const users = await this.getAllUsers();
      const user = users.find((user) => user.userid === userid);
      if (user) {
        user.mygroup.push(groupname);
        user.mygroup_myprofile.push({
          mygroupname: groupname,
          mygroup_nickname: userid,
          mygroup_img: '',
          mygroup_detail: userid,
        });
        await writeFile(this.FILE_NAME, JSON.stringify(users));
        return user;
      } else {
        throw new Error('User not found');
      }
    }
  async exitGroup(userid: string, groupname: string): Promise<UserInfo> {
    const users = await this.getAllUsers();
    const user = users.find((user) => user.userid === userid);
    if (user) {
      const index = user.mygroup.indexOf(groupname);
      if (index !== -1) {
        user.mygroup_myprofile = user.mygroup_myprofile.filter(
          (profile) => profile.mygroupname !== groupname
        );
        return user;
      }
    }
    throw new Error('User not found or not in the group');
  }

  async getUserMyGroupProfiles(userid: string, groupname: string): Promise<MyGroupProfile | null> {
    const users = await this.getAllUsers();
    const user = users.find((user) => user.userid === userid);
    if (user) {
      const profile = user.mygroup_myprofile.find(
        (profile) => profile.mygroupname === groupname
      );

      if (profile) {
        const { mygroupname, mygroup_nickname, mygroup_img, mygroup_detail } = profile;
        return { mygroupname, mygroup_nickname, mygroup_img, mygroup_detail };
      }
    }

    return null; // 사용자 또는 그룹 프로필을 찾을 수 없음
  }
  
  async editUserMyGroupProfiles(
    userid: string,
    groupname: string,
    mygroup_nickname: string,
    mygroup_img: string,
    mygroup_detail: string
  ): Promise<MyGroupProfile | null> {
    const users = await this.getAllUsers();
    const user = users.find((user) => user.userid === userid);
    if (user) {
      const profileIndex = user.mygroup_myprofile.findIndex(
        (profile) => profile.mygroupname === groupname
      );
  
      const mygroupname = groupname;
      if (profileIndex !== -1) {
        user.mygroup_myprofile[profileIndex] = {
          mygroupname,
          mygroup_nickname,
          mygroup_img,
          mygroup_detail,
        };
        await writeFile(this.FILE_NAME, JSON.stringify(users));
        return user.mygroup_myprofile[profileIndex];
      }
    }
  
    return null; // 사용자 또는 그룹 프로필을 찾을 수 없음
  }
  
}

@Injectable()
export class SignupMongoRepository implements SignupRepository {
    constructor(@InjectModel(Signup.name) private SignupModel: Model<SignupDocument>) {}
    async getAllUsers(): Promise<Signup[]> {
        return await this.SignupModel.find().exec();
    }

    async createUser(UserInfo: UserInfo) {
        const createUser = {
            ...UserInfo,
        };
        this.SignupModel.create(createUser);
    }
    async getUser(userid: String): Promise<UserInfo> {
      return await this.SignupModel.findOne({ userid }).exec()
    }

    async deleteUser(userid: String) {
        await this.SignupModel.findByIdAndDelete(userid);
    }

    async updateUser(userid: String, userInfo: UserInfo) {
        const updateUser = {userid, ...userInfo };
        await this.SignupModel.findByIdAndUpdate(userid, updateUser);
    }
    async validateUser(userid: string, pw: string) {
        const user = await this.SignupModel.findById(userid);
        if(!user) return null;
        if(user.pw === pw) return user;
        return null;
    }

    async joinGroup(userid: string, groupname: string): Promise<UserInfo> {
      const user = await this.getUser(userid);
      if (!user) {
        throw new Error('User not found');
      }
      const groupIndex = user.mygroup_myprofile.findIndex(
        (group) => group.mygroupname === groupname,
      );
      if (groupIndex !== -1) {
        throw new Error('User is already a member of the group');
      }
      user.mygroup_myprofile.push({ mygroupname: groupname, mygroup_nickname: '', mygroup_img: '', mygroup_detail: '' });
      return await this.SignupModel.findOneAndUpdate(
        { userid },
        { mygroup_myprofile: user.mygroup_myprofile },
        { new: true },
      ).exec();
    }
    
    async exitGroup(userid: string, groupname: string): Promise<UserInfo> {
      const user = await this.getUser(userid);
      if (!user) {
        throw new Error('User not found');
      }
      const groupIndex = user.mygroup_myprofile.findIndex(
        (group) => group.mygroupname === groupname,
      );
      if (groupIndex === -1) {
        throw new Error('User is not a member of the group');
      }
      user.mygroup_myprofile.splice(groupIndex, 1);
      return await this.SignupModel.findOneAndUpdate(
        { userid },
        { mygroup_myprofile: user.mygroup_myprofile },
        { new: true },
      ).exec();
    }
    
  async getUserMyGroupProfiles(userid: string, groupname: string): Promise<MyGroupProfile | null> {
    const user = await this.getUser(userid);
    if (user) {
      const profile = user.mygroup_myprofile.find(
        (profile) => profile.mygroupname === groupname
      );

      if (profile) {
        const { mygroupname, mygroup_nickname, mygroup_img, mygroup_detail } = profile;
        return { mygroupname, mygroup_nickname, mygroup_img, mygroup_detail };
      }
    }

    return null; // 사용자 또는 그룹 프로필을 찾을 수 없음
  }

  async getUserMyGroupLists(userid: string): Promise<string[]> {
    const user = await this.getUser(userid);
    if (user) {
      const groupList = user.mygroup;
      return groupList;
    }

    return null;
  }

  
  async editUserMyGroupProfiles(
    userid: string,
    groupname: string,
    mygroup_nickname: string,
    mygroup_img: string,
    mygroup_detail: string
  ): Promise<MyGroupProfile | null> {
    const user = await this.getUser(userid);
    if (user) {
      const profileIndex = user.mygroup_myprofile.findIndex(
        (profile) => profile.mygroupname === groupname
      );
      const mygroupname = groupname;
      if (profileIndex !== -1) {
        user.mygroup_myprofile[profileIndex] = {
          mygroupname,
          mygroup_nickname,
          mygroup_img,
          mygroup_detail,
        };
        await this.SignupModel.updateOne(
          { userid },
          { mygroup_myprofile: user.mygroup_myprofile },
          { new: true },
        ).exec();
        return user.mygroup_myprofile[profileIndex];
      }
    }
  
    return null; // 사용자 또는 그룹 프로필을 찾을 수 없음
  }



}