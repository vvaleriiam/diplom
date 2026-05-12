import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UpsertReviewDto } from "./dto/upsert-review.dto";
import { ReviewsService } from "./reviews.service";

@UseGuards(JwtAuthGuard)
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  mine(@CurrentUser() user: JwtUser) {
    return this.reviews.findMine(user.sub);
  }

  @Get("game/:gameId")
  forGame(@CurrentUser() user: JwtUser, @Param("gameId") gameId: string) {
    return this.reviews.getForGame(user.sub, gameId);
  }

  @Post()
  upsert(@CurrentUser() user: JwtUser, @Body() dto: UpsertReviewDto) {
    return this.reviews.upsert(user.sub, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.reviews.removeMine(user.sub, id);
  }
}
