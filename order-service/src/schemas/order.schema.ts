import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

@Schema()
export class Order {
  id: string;

  @Prop({ type: String, required: true })
  applicant: string;

  @Prop({ type: String, required: true })
  serviceId: string;

  @Prop({ type: String, required: true })
  status: OrderStatus;

  @Prop({ type: String, required: true })
  billId: string;

  @Prop({ type: Date, required: true, default: Date.now() })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
