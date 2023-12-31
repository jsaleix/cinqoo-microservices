import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IsInOrderGuard } from './guards/is-in-order.guard';
import { IsOrderOwner } from './guards/is-order-owner.guard';
import { IsServiceOwner } from './guards/is-service-owner.guard';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  // Admin specific routes

  @Get('/all')
  @Roles(ROLE.ADMIN)
  public getAllOrders() {
    return this.orderService.send('ORDER.GET_ALL_ORDERS_WITH_PRESTATION', {});
  }

  @Get('/user/:userId')
  @Roles(ROLE.ADMIN)
  public getUserOrders(@Param('userId') userId: string) {
    return this.orderService.send('ORDER.GET_ORDERS_OF_USER', userId);
  }

  @Get('/prestation/:prestationId')
  @Roles(ROLE.ADMIN)
  public getPrestationOrders(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.orderService.send(
      'ORDER.GET_ORDERS_OF_PRESTATION',
      prestationId,
    );
  }

  // User and freelancer specific routes

  @Get('/self')
  public getSelfOrders(@Req() req: any) {
    return this.orderService.send('ORDER.GET_ORDERS_OF_USER', req.user._id);
  }

  @Roles(ROLE.FREELANCER)
  @Get('/request/pending')
  public getSelfRequestOrders(@Req() req: any) {
    return this.orderService.send('ORDER.GET_PENDING_REQUESTS', req.user._id);
  }

  @Roles(ROLE.FREELANCER)
  @Get('/request/all')
  public getUserRequests(@Req() req: any) {
    return this.orderService.send('ORDER.GET_ALL_REQUESTS', req.user._id);
  }

  //Check if user is admin or owner of the service ordered
  @Patch('/request/:orderId/accept')
  @UseGuards(IsServiceOwner)
  public acceptRequestOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.send('ORDER.ACCEPT_REQUEST', {
      userId: req.user._id,
      orderId,
    });
  }

  //Check if user is admin or owner of the service ordered
  @Patch('/request/:orderId/refuse')
  @UseGuards(IsServiceOwner)
  public refuseRequestOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.send('ORDER.REFUSE_REQUEST', {
      userId: req.user._id,
      orderId,
    });
  }

  //the prestation provider can mark the order as done
  // However, the user can still ask for a revision
  //and must confirm the order is done so the payment can be done

  @Patch('/request/:orderId/terminate')
  @UseGuards(IsServiceOwner)
  async terminateOrder(@Req() req: any, @Param('orderId') orderId: string) {
    return this.orderService.send('ORDER.TERMINATE_ORDER', {
      userId: req.user._id,
      orderId,
    });
  }

  @Patch('/request/:orderId/confirm-finalization')
  @UseGuards(IsOrderOwner)
  async confirmFinalization(
    @Req() req: any,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.send('ORDER.CONFIRM_FINALIZATION', {
      userId: req.user._id,
      orderId,
    });
  }

  @Patch('/request/:orderId/ask-for-revision')
  @UseGuards(IsOrderOwner)
  async startRevision(@Req() req: any, @Param('orderId') orderId: string) {
    return this.orderService.send('ORDER.START_REVISION', {
      userId: req.user._id,
      orderId,
    });
  }

  @Roles(ROLE.ADMIN)
  @Put(':orderId')
  async updateOrder(
    @Param('orderId', CheckObjectIdPipe) orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.send('ORDER.UPDATE_STATUS_ORDER', {
      orderId,
      status: dto.status,
    });
  }

  //Check if user is admin or owner of the order
  @UseGuards(IsInOrderGuard)
  @Get(':orderId')
  public getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.send('ORDER.GET_ORDER_WITH_PRESTATION', orderId);
  }
}
