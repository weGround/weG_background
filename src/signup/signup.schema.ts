import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignupDocument = Signup & Document;

@Schema()
export class Signup {
    // @Prop({ required: true, unique: true })
    @Prop({ required: true, unique: true })
    userid: string;

    @Prop()
    pw: string;

}

export const SignupSchema = SchemaFactory.createForClass(Signup);