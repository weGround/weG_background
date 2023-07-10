import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInfo } from './signup.model';
import { Model} from 'mongoose';
import {SignupMongoRepository } from './signup.repository';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SignupService {
    constructor(private signupRepository: SignupMongoRepository, @InjectModel('Signup') private readonly signupModel: Model<UserInfo>,) {}

    async getAllUsers() {
        return await this.signupRepository.getAllUsers();
    }

    async createUser(userInfo: UserInfo) {
        const existingUser = await this.signupModel.findOne({ userid: userInfo.userid }).exec();
        if (existingUser) {
            throw new BadRequestException('이미 존재하는 사용자입니다.');
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
}