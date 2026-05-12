import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @IsOptional()
  @IsUrl({ require_tld: false })
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  steamId?: string | null;
}
