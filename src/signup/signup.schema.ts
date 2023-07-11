import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignupDocument = Signup & Document;

@Schema()
export class Signup {
    @Prop({ required: true, unique: true })
    userid: string;

    @Prop()
    pw: string;

    @Prop()
    mygroup: string[];

    @Prop({ type: [{ 
        mygroupname: String,
        mygroup_nickname: String,
        mygroup_img: String,
        mygroup_detail: String,
    }]})
    mygroup_myprofile: {
        mygroupname: string;
        mygroup_nickname: string;
        mygroup_img: string;
        mygroup_detail: string;
    }[];
}

export const SignupSchema = SchemaFactory.createForClass(Signup);