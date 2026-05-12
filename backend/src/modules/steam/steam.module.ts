import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesModule } from "../games/games.module";
import { LibraryModule } from "../library/library.module";
import { UserProfile } from "../users/entities/user-profile.entity";
import { SteamImport } from "./entities/steam-import.entity";
import { SteamController } from "./steam.controller";
import { SteamService } from "./steam.service";

@Module({
  imports: [HttpModule, GamesModule, LibraryModule, TypeOrmModule.forFeature([SteamImport, UserProfile])],
  controllers: [SteamController],
  providers: [SteamService],
})
export class SteamModule {}
