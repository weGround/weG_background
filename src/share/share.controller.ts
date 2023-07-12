import { Controller, Body, Get, Post, Param, Put, Delete, Request, Response } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareInfo } from './share.model';
import * as http from 'http';

@Controller('share')
export class ShareController {
    constructor(private shareService: ShareService) {}

    @Get()
    getAllShares() {
        console.log('모든 공유 게시물 가져오기');
        return this.shareService.getAllShares();
    }

    @Get('/getGroupPost/:group_name')
    getAllGroupShares(@Param('group_name') groupName: string) {
        console.log('그룹의 게시물 가져오기');
        return this.shareService.getAllGroupShares(groupName);
    }


    @Post()
    async createShare(@Body() shareInfo: ShareInfo, @Response() res ) {
      console.log('공유 게시물 생성');
      
      const createdShare = await this.shareService.createShare(shareInfo);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ _id: createdShare._id, message: 'share create success' }));
    }

    @Get('/getPost/:_id')
    async getShare(@Param('_id') _id: string) {
      console.log(`공유 게시물 가져오기`);
      const share = await this.shareService.getShare(_id);
      console.log(share);
      return share;
    }
  
    @Put('/update/:_id')
    updateShare(@Param('_id') _id: string, @Body() shareInfo) {
      console.log(`공유 게시물 정보 수정`);
      return this.shareService.updateShare(_id, shareInfo);
    }
   
    @Delete('/delete/:_id')
    deleteShare(@Param('_id') _id: string) {
      console.log('공유 게시물 삭제');
      return this.shareService.deleteShare(_id);
    }   
  
    @Put('/postLike/:_id')
    async postLike(@Param('_id') _id: string, @Body('likeUser') likeUser: string, @Response() res) {
      console.log(`좋아요 추가`);
      const share = await this.shareService.postLike(_id, likeUser);
      if (share) {
        return res.send({ message: '좋아요 추가 완료' });
      } else {
        return res.send({ message: '게시물을 찾을 수 없습니다' });
      }
    }
  
    @Post('/postComment/:_id')
    async postComment(
      @Param('_id') _id: string,
      @Body() commentInfo: { comment_detail: string, comment_writer: string },
    ) {
      console.log(`댓글 추가`);
      return this.shareService.postComment(_id, commentInfo);
    }
    
    // @Post('/postComment/:_id')
    // async postComment(
    //   @Param('_id') _id: string,
    //   @Body() commentInfo: { comment_id: number, comment_detail: string, comment_writer: string },
    // ) {
    //   console.log(`댓글 추가`);
    //   return this.shareService.postComment(_id, commentInfo);
    // }    
 
}