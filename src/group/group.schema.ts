import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {

    @Prop({ required: true, unique: true })
    groupname: string;

    @Prop()
    groupinfo: string;

    @Prop()
    groupimg: string;

    @Prop()
    groupmembers: string[];

}

export const GroupSchema = SchemaFactory.createForClass(Group);