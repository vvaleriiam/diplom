import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Genre } from "./entities/genre.entity";
import { Platform } from "./entities/platform.entity";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { IgdbService } from "./igdb.service";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Game, Genre, Platform])],
  controllers: [GamesController],
  providers: [GamesService, IgdbService],
  exports: [GamesService, TypeOrmModule],
})
export class GamesModule {}
