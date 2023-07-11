import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInfo, MyGroupProfile } from './signup.model';
import { userInfo } from 'os';
import { Model} from 'mongoose';
import {SignupMongoRepository } from './signup.repository';


@Injectable()
export class SignupService {
    constructor(private signupRepository: SignupMongoRepository, @InjectModel('Signup') private readonly signupModel: Model<UserInfo>,) {}

    async getAllUsers() {
        return await this.signupRepository.getAllUsers();
    }


    async createUser(userInfo: UserInfo) {
        const existingUser = await this.signupModel
        .findOne({ userid: userInfo.userid }).exec();
        if (existingUser) {
          return 'already exist';
        }
        return this.signupModel.create(userInfo);
      }

    async getUser(userid: string): Promise<UserInfo>{
        return this.signupModel.findOne({userid}).exec();
    }
    deleteUser(userid: string) {
        return this.signupModel.findOneAndDelete({ userid }).exec();
    }
    updateUser(userid: string, userInfo: UserInfo) {
        return this.signupModel.findOneAndUpdate({ userid }, userInfo, { new: true }).exec();
    }
    async validateUser(userid: string, pw: string) {
        const user = await this.getUser(userid);
        if(!user) {
            console.log('없는 사용자');
            return null;
        }
        if(pw === user.pw){
            console.log('인증성공')
            return userInfo;
        }
        console.log('비번틀림');
        return null;
    }
    async joinGroup(userid: string, groupname: string): Promise<UserInfo> {
      const user = await this.getUser(userid);
      if (!user) {
        throw new Error('User not found');
      }
      user.mygroup.push(groupname);
      user.mygroup_myprofile.push({
        mygroupname: groupname,
        mygroup_nickname: '',
        mygroup_img: '',
        mygroup_detail: '',
      });
    
      return await this.signupModel
        .findOneAndUpdate({ userid }, { mygroup: user.mygroup, mygroup_myprofile: user.mygroup_myprofile }, { new: true })
        .exec();
    }
    
    async exitGroup(userid: string, groupname: string) {
      const user = await this.getUser(userid);
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return null;
      }
    
      const index = user.mygroup.indexOf(groupname);
      if (index === -1) {
        console.log('가입되어 있지 않음');
        return '가입 안됨';
      }
    
      // mygroup_myprofile 배열에서 원소 제거
      user.mygroup_myprofile = user.mygroup_myprofile.filter(
        (profile) => profile.mygroupname !== groupname
      );
    
      // mygroup 배열에서 원소 제거
      user.mygroup.splice(index, 1);
      return await this.signupModel
        .findOneAndUpdate({ userid }, { mygroup: user.mygroup, mygroup_myprofile: user.mygroup_myprofile }, { new: true })
        .exec();
    }
    

    async getUserMyGroupProfiles(userid: string, groupname: string): Promise<MyGroupProfile | null> {
      return this.signupRepository.getUserMyGroupProfiles(userid, groupname);
    }
}