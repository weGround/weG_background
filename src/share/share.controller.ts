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

    // @Post()
    // async createShare(@Body() shareInfo, @Response() res) {
    //     console.log('공유 게시물 생성');
    //     const message = await this.shareService.createShare(shareInfo);
        
    //     if (typeof message === 'string') {
    //         return res.send({ message });
    //     }
        
    //     return res.send({ message: 'share create success' });
    // }
    @Post()
    async createShare(@Body() shareInfo: ShareInfo, @Response() res ) {
      console.log('공유 게시물 생성');
      
      const createdShare = await this.shareService.createShare(shareInfo);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ _id: createdShare._id, message: 'share create success' }));
    }


    @Get('/getPost/:post_id')
    async getShare(@Param('post_id') postId: number) {
        console.log(`공유 게시물 가져오기`);
        const share = await this.shareService.getShare(postId);
        console.log(share);
        return share;
    }

    @Put('/update/:post_id')
    updateShare(@Param('post_id') postId: number, @Body() shareInfo) {
        console.log(`공유 게시물 정보 수정`);
        return this.shareService.updateShare(postId, shareInfo);
    }
 
    @Delete('/delete/:post_id')
    deleteShare(@Param('post_id') postId: number) {
        console.log('공유 게시물 삭제');
        return this.shareService.deleteShare(postId);
    }   

    @Put('/postLike/:post_id')
    async postLike(@Param('post_id') postId: number, @Body('likeUser') likeUser: string, @Response() res) {
        console.log(`좋아요 추가`);
        const share = await this.shareService.postLike(postId, likeUser);
        if (share) {
            return res.send({ message: '좋아요 추가 완료' });
        } else {
            return res.send({ message: '게시물을 찾을 수 없습니다' });
        }
    }
    @Post('/postComment/:post_id')
        async postComment(
        @Param('post_id') postId: number,
        @Body() commentInfo: { comment_id: number, comment_detail: string, comment_writer: string },
        ) {
        console.log(`댓글 추가`);
        return this.shareService.postComment(postId, commentInfo);
    }   
}