import { IsArray, IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class UpsertGameDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsInt()
  igdbId?: number | null;

  @IsOptional()
  @IsInt()
  steamAppId?: number | null;

  @IsOptional()
  @IsDateString()
  releaseDate?: string | null;

  @IsOptional()
  @IsArray()
  genres?: string[];

  @IsOptional()
  @IsArray()
  platforms?: string[];
}
