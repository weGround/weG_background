import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import internal from 'stream';

export type ShareDocument = Share & Document;

@Schema()
export class Share {
    @Prop()
    post_group: string;
    
    @Prop()
    post_title: string;

    @Prop()
    post_detail: string;

    @Prop()
    post_img: string;

    @Prop()
    post_writer: string;

    @Prop()
    like_count: number;

    @Prop()
    like_users: string[];

    @Prop({ type: [{ 
        comment_detail: String,
        comment_writer: String,
    }]})
    comments: {
        comment_detail: string;
        comment_writer: string;
    }[];
}

export const ShareSchema = SchemaFactory.createForClass(Share);