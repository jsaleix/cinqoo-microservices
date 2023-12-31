import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ type: String, required: true })
  orderId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
