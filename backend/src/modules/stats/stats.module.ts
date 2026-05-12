import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Library } from "../library/entities/library.entity";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
