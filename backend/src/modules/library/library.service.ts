import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddLibraryDto, UpdateLibraryDto } from "./dto/library.dto";
import { Library, LibraryStatus } from "./entities/library.entity";

@Injectable()
export class LibraryService {
  constructor(@InjectRepository(Library) private readonly libraries: Repository<Library>) {}

  findUserLibrary(userId: string, status?: LibraryStatus) {
    return this.libraries.find({
      where: status ? { userId, status } : { userId },
      relations: { game: { genres: true, platforms: true } },
      order: { updatedAt: "DESC" },
    });
  }

  async getEntry(userId: string, gameId: string) {
    return this.libraries.findOne({ where: { userId, gameId } });
  }

  async add(userId: string, dto: AddLibraryDto) {
    const existing = await this.getEntry(userId, dto.gameId);
    if (existing) {
      existing.status = dto.status;
      existing.source = dto.source || existing.source;
      if (dto.status === "finished" && !existing.finishedAt) {
        existing.finishedAt = new Date().toISOString().split("T")[0];
      }
      return this.libraries.save(existing);
    }
    const finishedAt = dto.status === "finished" ? new Date().toISOString().split("T")[0] : null;
    return this.libraries.save({ userId, gameId: dto.gameId, status: dto.status, source: dto.source || "manual", finishedAt });
  }

  async update(userId: string, id: string, dto: UpdateLibraryDto) {
    const entry = await this.libraries.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException("Library entry not found");
    entry.status = dto.status;
    if (dto.finishedAt !== undefined) {
      entry.finishedAt = dto.finishedAt;
    } else if (dto.status === "finished" && !entry.finishedAt) {
      entry.finishedAt = new Date().toISOString().split("T")[0];
    }
    return this.libraries.save(entry);
  }

  async remove(userId: string, id: string) {
    await this.libraries.delete({ id, userId });
    return { ok: true };
  }
}
