import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { GamesService } from "./games.service";

@UseGuards(JwtAuthGuard)
@Controller("games")
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Get()
  catalog(@Query("q") q?: string) {
    return this.games.findCatalog(q);
  }

  @Post("search")
  search(@Body("q") q: string, @CurrentUser() _user: JwtUser) {
    return this.games.search(q);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.games.getById(id);
  }
}
