import { InjectModel } from '@nestjs/mongoose';
import { Model, TypeExpressionOperatorReturningObjectId } from 'mongoose';
import { Signup, SignupDocument } from './signup.schema';
import { Injectable } from '@nestjs/common';
import {readFile, writeFile } from 'fs/promises';
import {UserInfo} from './signup.model';
import { userInfo } from 'os';

export interface SignupRepository {
    getAllUsers(): Promise<UserInfo[]>;
    createUser(userInfo: UserInfo);
    getUser(userid: String);
    deleteUser(userid: String);
    updateUser(userid: String, userInfo: UserInfo);
    validateUser(userid: string, pw: string);
    joinGroup(userid: string, groupname: string): Promise<UserInfo>;
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
          await writeFile(this.FILE_NAME, JSON.stringify(users));
          return user;
        } else {
          throw new Error('User not found');
        }
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
        return await this.SignupModel.findById(userid);
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
        user.mygroup.push(groupname);
        return await this.SignupModel.findOneAndUpdate(
          { userid },
          { mygroup: user.mygroup },
          { new: true },
        ).exec();
      }


}