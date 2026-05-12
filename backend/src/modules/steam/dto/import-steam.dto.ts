import { IsString } from "class-validator";

export class ImportSteamDto {
  @IsString()
  steamIdOrUrl: string;
}
