import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

type IgdbToken = { accessToken: string; expiresAt: number };

@Injectable()
export class IgdbService {
  private readonly logger = new Logger(IgdbService.name);
  private token: IgdbToken | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async search(query: string) {
    const clientId = this.config.get<string>("IGDB_CLIENT_ID");
    const clientSecret = this.config.get<string>("IGDB_CLIENT_SECRET");
    if (!clientId || !clientSecret) return [];

    const accessToken = await this.getAccessToken(clientId, clientSecret);
    const body = [
      `search "${query.replaceAll('"', "")}";`,
      "fields name,summary,cover.url,first_release_date,genres.name,genres.id,platforms.name,platforms.id,external_games.uid,external_games.category;",
      "limit 20;",
    ].join(" ");

    const response = await firstValueFrom(
      this.http.post("https://api.igdb.com/v4/games", body, {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }),
    );

    return response.data.map((game: any) => ({
      title: game.name,
      description: game.summary || null,
      image: game.cover?.url ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}` : null,
      igdbId: game.id,
      steamAppId: this.extractSteamAppId(game.external_games),
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10) : null,
      genres: (game.genres || []).map((genre: any) => ({ name: genre.name, igdbId: genre.id })),
      platforms: (game.platforms || []).map((platform: any) => ({ name: platform.name, igdbId: platform.id })),
    }));
  }

  private async getAccessToken(clientId: string, clientSecret: string) {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) return this.token.accessToken;

    const response = await firstValueFrom(
      this.http.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        },
      }),
    );
    this.token = {
      accessToken: response.data.access_token,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };
    return this.token.accessToken;
  }

  private extractSteamAppId(externalGames: any[] | undefined) {
    const steam = externalGames?.find((external) => external.category === 1 && external.uid);
    const parsed = steam ? Number(steam.uid) : null;
    return Number.isFinite(parsed) ? parsed : null;
  }
}
