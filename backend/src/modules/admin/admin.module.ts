import { Module } from "@nestjs/common";
import { GamesModule } from "../games/games.module";
import { ReviewsModule } from "../reviews/reviews.module";
import { UsersModule } from "../users/users.module";
import { AdminController } from "./admin.controller";

@Module({
  imports: [UsersModule, ReviewsModule, GamesModule],
  controllers: [AdminController],
})
export class AdminModule {}
