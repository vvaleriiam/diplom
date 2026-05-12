import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { GamesModule } from "./modules/games/games.module";
import { LibraryModule } from "./modules/library/library.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { StatsModule } from "./modules/stats/stats.module";
import { SteamModule } from "./modules/steam/steam.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>("DATABASE_URL");
        if (databaseUrl?.startsWith("postgres")) {
          return {
            type: "postgres",
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return {
          type: "sqljs",
          location: "playd.sqlite",
          autoSave: true,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    GamesModule,
    LibraryModule,
    ReviewsModule,
    StatsModule,
    SteamModule,
    AdminModule,
  ],
})
export class AppModule {}
