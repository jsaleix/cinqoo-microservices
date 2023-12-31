import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DoneRequestDto } from './dto/done-request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @EventPattern('ORDER.CREATE')
  async createOrder(@Payload() data: any) {
    return await this.appService.createOrder(data);
  }

  @EventPattern('ORDER.GET_ORDER')
  async getOrder(orderId: string) {
    return await this.appService.getOrder(orderId);
  }

  @EventPattern('ORDER.GET_ORDER_WITH_PRESTATION')
  async getOrderWithService(orderId: string) {
    return await this.appService.getOrderWithPrestation(orderId);
  }

  @EventPattern('ORDER.GET_ALL_ORDERS')
  async getAllOrder() {
    return await this.appService.getAllOrders();
  }

  @EventPattern('ORDER.GET_ALL_ORDERS_WITH_PRESTATION')
  async getAllOrdersWithPrestation() {
    return await this.appService.getAllOrdersWithPrestation();
  }

  @EventPattern('ORDER.GET_ORDERS_OF_USER')
  async getOrdersByUser(userId: string) {
    return await this.appService.getOrdersOfUser(userId);
  }

  @EventPattern('ORDER.GET_USERS')
  async getUsers(@Payload() orderId: string) {
    return await this.appService.getUsers(orderId);
  }

  @EventPattern('ORDER.GET_ORDERS_OF_PRESTATION')
  async getOrdersByPrestation(prestationId: string) {
    return await this.appService.getOrdersOfPrestation(prestationId);
  }

  // Requests

  @EventPattern('ORDER.GET_ALL_REQUESTS')
  async getAllRequests(@Payload() userId: string) {
    return await this.appService.getRequests(userId);
  }

  @EventPattern('ORDER.GET_PENDING_REQUESTS')
  async getPendingRequest(@Payload() userId: string) {
    return await this.appService.getPendingRequests(userId);
  }

  @EventPattern('ORDER.ACCEPT_REQUEST')
  async acceptRequest(@Payload() data: UpdateRequestDto) {
    return await this.appService.acceptRequest(data);
  }

  @EventPattern('ORDER.REFUSE_REQUEST')
  async refuseRequest(@Payload() data: UpdateRequestDto) {
    return await this.appService.refuseRequest(data);
  }

  @EventPattern('ORDER.TERMINATE_ORDER')
  async terminateRequest(@Payload() data: UpdateRequestDto) {
    return await this.appService.terminateRequest(data);
  }

  @EventPattern('ORDER.CONFIRM_FINALIZATION')
  async confirmFinalization(@Payload() data: UpdateRequestDto) {
    return await this.appService.confirmFinalization(data);
  }

  @EventPattern('ORDER.START_REVISION')
  async startRevision(@Payload() data: UpdateRequestDto) {
    return await this.appService.startRevision(data);
  }

  @EventPattern('ORDER.UPDATE_STATUS_ORDER')
  async updateStatusOrder(@Payload() data: UpdateOrderDto) {
    return await this.appService.updateStatusOrder(data);
  }

  @EventPattern('ORDER.HAS_DONE')
  async hasDone(@Payload() data: DoneRequestDto) {
    return await this.appService.hasDone(data);
  }
}
