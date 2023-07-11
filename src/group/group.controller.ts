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
    


}
