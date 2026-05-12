import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { StatsService } from "./stats.service";

@UseGuards(JwtAuthGuard)
@Controller("stats")
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  mine(@CurrentUser() user: JwtUser) {
    return this.stats.getUserStats(user.sub);
  }
}
