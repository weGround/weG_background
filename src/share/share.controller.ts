import { Controller, Body, Get, Post, Param, Put, Delete, Request, Response } from '@nestjs/common';
import { ShareService } from './share.service';

@Controller('share')
export class ShareController {
    constructor(private shareService: ShareService) {}

    @Get()
    getAllShares() {
        console.log('모든 공유 게시물 가져오기');
        return this.shareService.getAllShares();
    }

    @Post()
    async createShare(@Body() shareInfo, @Response() res) {
        console.log('공유 게시물 생성');
        const message = await this.shareService.createShare(shareInfo);
        
        if (typeof message === 'string') {
            return res.send({ message });
        }
        
        return res.send({ message: 'share create success' });
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
}