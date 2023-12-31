export class BroadcastDto {
  message: {
    type: string;
    data: object | string;
  };
}

export class BroadcastOrderDto extends BroadcastDto {
  orderId: string;
}

export class BroadcastUserDto extends BroadcastDto {
  userId: string;
}
