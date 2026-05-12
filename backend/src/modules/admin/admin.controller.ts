import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { GamesService } from "../games/games.service";
import { UpsertGameDto } from "../games/dto/upsert-game.dto";
import { ReviewsService } from "../reviews/reviews.service";
import { UsersService } from "../users/users.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly users: UsersService,
    private readonly reviews: ReviewsService,
    private readonly games: GamesService,
  ) {}

  @Get("users")
  usersList() {
    return this.users.findAll();
  }

  @Delete("users/:id")
  deleteUser(@Param("id") id: string) {
    return this.users.deleteUser(id);
  }

  @Get("reviews")
  reviewsList() {
    return this.reviews.findAll();
  }

  @Delete("reviews/:id")
  deleteReview(@Param("id") id: string) {
    return this.reviews.removeAny(id);
  }

  @Post("games")
  createGame(@Body() dto: UpsertGameDto) {
    return this.games.create(dto);
  }

  @Patch("games/:id")
  updateGame(@Param("id") id: string, @Body() dto: UpsertGameDto) {
    return this.games.update(id, dto);
  }

  @Delete("games/:id")
  deleteGame(@Param("id") id: string) {
    return this.games.delete(id);
  }
}
