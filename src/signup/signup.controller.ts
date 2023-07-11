import { Controller, Body, Get, Post, Param, Put, Delete, Request, Response } from '@nestjs/common';
import { SignupService } from './signup.service';
import { UserInfo, MyGroupProfile } from './signup.model';
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


    @Post('/joinGroup/:userid')
    joinGroup(@Param('userid') userid: string, @Body('groupname') groupname: string): Promise<UserInfo> {
      return this.signupService.joinGroup(userid, groupname);
    }
  
    @Delete('/exitGroup/:userid/:groupname')
    exitGroup(@Param('userid') userid: string, @Param('groupname') groupname: string) {
      console.log('그룹 탈퇴');
      return this.signupService.exitGroup(userid, groupname);
    }

    @Get('/getUserMyGroupLists/:userid')
    async getUserMyGroupLists(
      @Param('userid') userid: string
    ) {
      console.log(`그룹들 가져오기`);
      return this.signupService.getUserMyGroupLists(userid);
  }

    @Get('/getUserMyGroupProfiles/:userid/:groupname')
    async getUserMyGroupProfiles(
      @Param('userid') userid: string,
      @Param('groupname') groupname: string
    ) {
      console.log(`그룹 프로필 가져오기`);
      return this.signupService.getUserMyGroupProfiles(userid, groupname);
  }

  @Put('/editUserMyGroupProfiles/:userid/:groupname')
    editUserMyGroupProfiles(
      @Param('userid') userid: string,
      @Param('groupname') groupname: string,
      @Body('mygroupname') mygroupname: string,
      @Body('mygroup_nickname') mygroup_nickname: string,
      @Body('mygroup_img') mygroup_img: string,
      @Body('mygroup_detail') mygroup_detail: string
    ): Promise<MyGroupProfile | null> {
      return this.signupService.editUserMyGroupProfiles(
        userid,
        groupname,
        mygroupname,
        mygroup_nickname,
        mygroup_img,
        mygroup_detail
  );
}


}
