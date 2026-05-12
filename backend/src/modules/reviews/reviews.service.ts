import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Library } from "../library/entities/library.entity";
import { UpsertReviewDto } from "./dto/upsert-review.dto";
import { Review } from "./entities/review.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Library) private readonly libraries: Repository<Library>,
  ) {}

  findMine(userId: string) {
    return this.reviews.find({ where: { userId }, order: { createdAt: "DESC" } });
  }

  async upsert(userId: string, dto: UpsertReviewDto) {
    const libraryEntry = await this.libraries.findOne({ where: { userId, gameId: dto.gameId } });
    if (!libraryEntry || libraryEntry.status !== "finished") {
      throw new BadRequestException("Reviews are available only for finished games");
    }
    const existing = await this.reviews.findOne({ where: { userId, gameId: dto.gameId } });
    return this.reviews.save({ id: existing?.id, userId, gameId: dto.gameId, rating: dto.rating, body: dto.body || null });
  }

  async getForGame(userId: string, gameId: string) {
    return this.reviews.findOne({ where: { userId, gameId } });
  }

  async removeMine(userId: string, id: string) {
    const review = await this.reviews.findOne({ where: { id, userId } });
    if (!review) throw new NotFoundException("Review not found");
    await this.reviews.delete(id);
    return { ok: true };
  }

  findAll() {
    return this.reviews.find({ relations: { user: { profile: true }, game: true }, order: { createdAt: "DESC" } });
  }

  async removeAny(id: string) {
    await this.reviews.delete(id);
    return { ok: true };
  }
}
