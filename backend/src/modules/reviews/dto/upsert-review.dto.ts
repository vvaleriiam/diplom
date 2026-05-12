import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class UpsertReviewDto {
  @IsUUID()
  gameId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsString()
  body?: string | null;
}
