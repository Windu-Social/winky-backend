import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ type: String, required: true })
  receiverId: string;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: String, required: false })
  room: string | undefined;

  @Prop({ type: [String], required: true })
  paticipants: string[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
