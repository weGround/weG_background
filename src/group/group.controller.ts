import { Controller, Body, Get, Post, Param, Put, Delete, Request, Response } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService) {}

    @Get()
    getAllGruops() {
        console.log('모든 그룹 가져오기');
        return this.groupService.getAllGruops();
    }

    @Post()
    async createGroup(@Body() groupinfo, @Response() res) {
      console.log('그룹 생성');
      const message = await this.groupService.createGroup(groupinfo);
      
      if (typeof message === 'string') {
        return res.send({ message });
      }
      
      return res.send({ message: 'group create success' });
    }

    @Get('/getGroup/:groupname')
    async getGroup(@Param('groupname') groupname: string) {
        console.log(`그룹 찾기`);
        const group = await this.groupService.getGroup(groupname);
        console.log(group);
        return group;
    }

    @Put('/update/:groupname')
    updateGroup(@Param('groupname') groupname:string, @Body() groupInfo) {
        console.log(`그룹 정보 수정`);
        return this.groupService.updateGroup(groupname, groupInfo);
    }
 
    @Delete('/delete/:groupname')
    deleteGroup(@Param('groupname') groupname:string) {
        console.log('그룹 삭제');
        return this.groupService.deleteGroup(groupname);
    }   
    @Get('/getMems/:groupname')
    async getMems(@Param('groupname') groupname: string) {
      console.log(`그룹 멤버 가져오기`);
      return this.groupService.getMems(groupname);
    }
    
    @Put('/updateMems/:groupname')
    updateMems(@Param('groupname') groupname: string, @Body('newmember') newmember: string) {
      console.log(`그룹 멤버 추가`);
      return this.groupService.updateMems(groupname, newmember);
    }

    @Delete('/deleteMems/:groupname')
    deleteMems(@Param('groupname') groupname:string, @Body('deletemember') deletemember: string) {
      console.log(`그룹 멤버 삭제`);
      return this.groupService.deleteMems(groupname, deletemember);
    }

    @Get('/getImg/:groupname')
    async getImg(@Param('groupname') groupname: string) {
      console.log(`그룹 이미지 가져오기`);
      return this.groupService.getImg(groupname);
    }

    @Put('/updateImg/:groupname')
    updateImg(@Param('groupname') groupname:string, @Body('groupimg') groupimg: string) {
        console.log(`그룹 이미지 수정`);
        return this.groupService.updateImg(groupname, groupimg);
    }

    @Put('/updateInfo/:groupname')
    updateInfo(@Param('groupname') groupname:string, @Body() GroupInfo) {
        console.log(`그룹 정보 수정`);
        return this.groupService.updateInfo(groupname, GroupInfo);
    }

}
