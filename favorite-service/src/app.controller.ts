import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  FavoriteRequestDto,
  FavoriteResultDto,
  GetFavoritesDto,
} from './dto/favorite-express.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('FAVORITE.GET_SELF')
  async getSelfFavorites(@Payload() data: GetFavoritesDto) {
    return await this.appService.getSelfFavorites(data.userId);
  }

  @EventPattern('FAVORITE.PUT')
  async addOrDeleteFavorite(
    @Payload() data: FavoriteRequestDto,
  ): Promise<FavoriteResultDto> {
    return await this.appService.addOrDeleteFavorite(data);
  }

  @EventPattern('FAVORITE.GET_SPECIFIC')
  async getSpecificFavorite(@Payload() data: FavoriteRequestDto) {
    return await this.appService.getSpecificFavorite(data);
  }
}
