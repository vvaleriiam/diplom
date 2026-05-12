import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Library } from "../library/entities/library.entity";

@Injectable()
export class StatsService {
  constructor(@InjectRepository(Library) private readonly libraries: Repository<Library>) {}

  async getUserStats(userId: string) {
    const entries = await this.libraries.find({
      where: { userId },
      relations: { game: { genres: true } },
      order: { createdAt: "ASC" },
    });

    const byStatus = {
      playing: entries.filter((entry) => entry.status === "playing").length,
      finished: entries.filter((entry) => entry.status === "finished").length,
      abandoned: entries.filter((entry) => entry.status === "abandoned").length,
    };

    const genreCounts = new Map<string, number>();
    entries
      .filter((entry) => entry.status === "finished")
      .forEach((entry) => {
        entry.game.genres?.forEach((genre) => genreCounts.set(genre.name, (genreCounts.get(genre.name) || 0) + 1));
      });

    const activity = new Map<string, number>();
    entries.forEach((entry) => {
      const month = entry.createdAt.toISOString().slice(0, 7);
      activity.set(month, (activity.get(month) || 0) + 1);
    });

    return {
      total: entries.length,
      byStatus,
      favoriteGenres: Array.from(genreCounts.entries()).map(([name, count]) => ({ name, count })),
      activity: Array.from(activity.entries()).map(([month, count]) => ({ month, count })),
    };
  }
}
