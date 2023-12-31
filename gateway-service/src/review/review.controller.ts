import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { CreateReviewDto } from './dto/create-review.dto';
import { HasDoneOrderGuard } from './guards/has-done-order.guard';
import { PrestationExistsGuard } from './guards/prestation-exists.guard';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientProxy,
  ) {}

  @UseGuards(PrestationExistsGuard)
  @Public()
  @Get(':prestationId/average')
  public getAverageForPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.reviewService.send('REVIEW.GET_AVERAGE_ON_PRESTATION', {
      prestationId,
    });
  }

  @Get(':prestationId/canPublish')
  public canPublishReview(
    @Req() req,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.reviewService.send('REVIEW.CAN_PUBLISH', {
      prestationId,
      userId: req.user._id,
    });
  }

  @UseGuards(PrestationExistsGuard)
  @Public()
  @Get(':prestationId')
  public getReviewForPrestation(
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
  ) {
    return this.reviewService.send('REVIEW.GET_PRESTATION', {
      prestationId,
    });
  }

  @Roles(ROLE.ADMIN)
  @Get('user/:userId')
  public getReviewsByUser(@Param('userId', CheckObjectIdPipe) userId: string) {
    return this.reviewService.send('REVIEW.GET_BY_USER', userId);
  }

  @UseGuards(PrestationExistsGuard)
  @UseGuards(HasDoneOrderGuard)
  @Post(':prestationId')
  public createReview(
    @Req() req,
    @Param('prestationId', CheckObjectIdPipe) prestationId: string,
    @Body() data: CreateReviewDto,
  ) {
    return this.reviewService.send('REVIEW.CREATE', {
      ...data,
      prestationId,
      userId: req.user._id,
    });
  }
}
