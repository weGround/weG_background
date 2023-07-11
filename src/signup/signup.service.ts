import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInfo } from './signup.model';
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




    async joinGroup(userid: string, groupId: string) {
        const user = await this.getUser(userid);
        if (!user) {
          throw new Error('User not found');
        }
        user.mygroup.push(groupId);
        return this.updateUser(userid, user);
      }
    
      async getMygroup(userid: string) {
        const user = await this.getUser(userid);
        if (!user) {
          throw new Error('User not found');
        }
        return user.mygroup;
      }
    
    //   async myGroupProfile(groupId: string, groupProfile: {
    //     mygroupname: string;
    //     mygroup_nickname: string;
    //     mygroup_img: string;
    //     mygroup_detail: string;
    //   }) {
    //     const user = await this.signupRepository.getUser(groupId);
    //     if (!user) {
    //       throw new Error('User not found');
    //     }
    //     user.mygroup_myprofile = {
    //       mygroupname: groupId,
    //       ...groupProfile,
    //     };
    //     return this.signupRepository.updateUser(groupId, user);
    //   }
}