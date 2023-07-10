import { Controller, Body, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {
    constructor(private signupSrevice: SignupService) {}

    @Get()
    getAllUsers() {
        console.log('모든 유저 가져오기');
        return this.signupSrevice.getAllUsers();
    }

    @Post() 
    createUser(@Body() userInfo){
        console.log('유저 회원가입');
        this.signupSrevice.createUser(userInfo);
    } 

    @Get('/getUser/:userid')
    async getUser(@Param('userid') userid: string) {
        console.log(`유저찾기`);
        const user = await this.signupSrevice.getUser(userid);
        console.log(user);
        return user;
    }

    @Put('/update/:userid')
    updateUser(@Param('userid') userid:string, @Body() userInfo) {
        console.log(`유저 정보 수정`);
        return this.signupSrevice.updateUser(userid, userInfo);
    }

    @Delete('/delete/:userid')
    deleteUser(@Param('userid') userid:string) {
        console.log('유저 삭제');
        return this.signupSrevice.deleteUser(userid);
    }
}
