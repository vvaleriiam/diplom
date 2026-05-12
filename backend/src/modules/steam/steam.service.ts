import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { GamesService } from "../games/games.service";
import { LibraryService } from "../library/library.service";
import { UserProfile } from "../users/entities/user-profile.entity";
import { ImportSteamDto } from "./dto/import-steam.dto";
import { SteamImport } from "./entities/steam-import.entity";

@Injectable()
export class SteamService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly games: GamesService,
    private readonly library: LibraryService,
    @InjectRepository(SteamImport) private readonly imports: Repository<SteamImport>,
    @InjectRepository(UserProfile) private readonly profiles: Repository<UserProfile>,
  ) {}

  async import(userId: string, dto: ImportSteamDto) {
    const apiKey = this.config.get<string>("STEAM_API_KEY");
    if (!apiKey) throw new BadRequestException("Steam API key is not configured");
    const steamId = this.extractSteamId(dto.steamIdOrUrl);
    await this.profiles.update({ userId }, { steamId });

    try {
      const response = await firstValueFrom(
        this.http.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/", {
          params: { key: apiKey, steamid: steamId, include_appinfo: 1 },
        }),
      );
      const ownedGames = response.data?.response?.games || [];
      let imported = 0;
      let failed = 0;

      for (const owned of ownedGames) {
        const game = await this.games.findBySteamAppId(Number(owned.appid));
        if (!game) {
          failed += 1;
          continue;
        }
        await this.library.add(userId, { gameId: game.id, status: "playing", source: "steam" });
        imported += 1;
      }

      return this.imports.save({ userId, importedAmount: imported, failedImport: failed, status: "completed" });
    } catch (_error) {
      await this.imports.save({ userId, importedAmount: 0, failedImport: 0, status: "failed_private_or_unavailable" });
      throw new BadRequestException("Steam profile is private or unavailable");
    }
  }

  private extractSteamId(input: string) {
    const match = input.match(/(\d{17})/);
    return match?.[1] || input.trim();
  }
}
