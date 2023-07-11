import { Controller, Body, Get, Post, Param, Put, Delete, Request, Response } from '@nestjs/common';
import { SignupService } from './signup.service';
import { stringify } from 'querystring';

@Controller('signup')
export class SignupController {
    constructor(private signupService: SignupService) {}

    @Get()
    getAllUsers() {
        console.log('모든 유저 가져오기');
        return this.signupService.getAllUsers();
    }

    @Post()
    async createUser(@Body() userInfo, @Response() res) {
      console.log('유저 회원가입');
      const message = await this.signupService.createUser(userInfo);
      
      if (typeof message === 'string') {
        return res.send({ message });
      }
      
      return res.send({ message: 'signup success' });
    }

    @Get('/getUser/:userid')
    async getUser(@Param('userid') userid: string) {
        console.log(`유저찾기`);
        const user = await this.signupService.getUser(userid);
        console.log(user);
        return user;
    }

    @Put('/update/:userid')
    updateUser(@Param('userid') userid:string, @Body() userInfo) {
        console.log(`유저 정보 수정`);
        return this.signupService.updateUser(userid, userInfo);
    }

    @Delete('/delete/:userid')
    deleteUser(@Param('userid') userid:string) {
        console.log('유저 삭제');
        return this.signupService.deleteUser(userid);
    }

    @Post('login')
    async login(@Request() req, @Response() res) {
      const userInfo = await this.signupService.validateUser(req.body.userid, req.body.pw);
    
      if (userInfo !== null) {
        res.cookie('login', JSON.stringify(userInfo), {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        // 쿠키를 설정한 후에 반환할 메시지
        return res.send({ message: 'login success' });
      }
    
      // 유저 정보 일치하지 않는 경우의 처리
      return res.send({ message: 'login failed' });
    }


    @Put('/joinGroup/:userid')
    async joinGroup(@Param('userid') userid: string, @Body('groupname') groupname: string) {
      console.log(`그룹에 유저 추가`);
      return this.signupService.joinGroup(userid, groupname);
    }
  



}
