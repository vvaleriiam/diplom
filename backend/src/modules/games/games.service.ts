import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { Genre } from "./entities/genre.entity";
import { Platform } from "./entities/platform.entity";
import { IgdbService } from "./igdb.service";
import { UpsertGameDto } from "./dto/upsert-game.dto";

@Injectable()
export class GamesService implements OnModuleInit {
  constructor(
    @InjectRepository(Game) private readonly games: Repository<Game>,
    @InjectRepository(Genre) private readonly genres: Repository<Genre>,
    @InjectRepository(Platform) private readonly platforms: Repository<Platform>,
    private readonly igdb: IgdbService,
  ) {}

  async onModuleInit() {
    const steam = (id: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
    const seeds = [
      {
        title: "Elden Ring",
        description: "Open-world action RPG set in the Lands Between, with challenging combat and a vast fantasy world.",
        image: steam(1245620),
        igdbId: 119133,
        steamAppId: 1245620,
        releaseDate: "2022-02-25",
        genres: ["Action RPG", "Open World"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "The Witcher 3: Wild Hunt",
        description: "Story-driven open-world RPG following Geralt of Rivia through a war-torn fantasy continent.",
        image: steam(292030),
        igdbId: 1942,
        steamAppId: 292030,
        releaseDate: "2015-05-19",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
      },
      {
        title: "Hades",
        description: "Roguelite action game about escaping the Underworld with fast combat and reactive storytelling.",
        image: steam(1145360),
        igdbId: 113112,
        steamAppId: 1145360,
        releaseDate: "2020-09-17",
        genres: ["Roguelite", "Action"],
        platforms: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
      },
      {
        title: "Hollow Knight",
        description: "Atmospheric metroidvania adventure through the ruined insect kingdom of Hallownest.",
        image: steam(367520),
        igdbId: 11208,
        steamAppId: 367520,
        releaseDate: "2017-02-24",
        genres: ["Metroidvania", "Adventure"],
        platforms: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
      },
      {
        title: "Cyberpunk 2077",
        description: "Open-world RPG set in Night City, centered on mercenary V and a fight for survival.",
        image: steam(1091500),
        igdbId: 1877,
        steamAppId: 1091500,
        releaseDate: "2020-12-10",
        genres: ["RPG", "Open World"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "Baldur's Gate 3",
        description: "Party-based RPG in the Forgotten Realms with deep choices, tactical combat, and co-op.",
        image: steam(1086940),
        igdbId: 119171,
        steamAppId: 1086940,
        releaseDate: "2023-08-03",
        genres: ["RPG", "Strategy"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "Dark Souls III",
        description: "Challenging action RPG set in a dying world, demanding precise combat and exploration.",
        image: steam(374320),
        igdbId: 11133,
        steamAppId: 374320,
        releaseDate: "2016-04-12",
        genres: ["Action RPG", "Souls-like"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Sekiro: Shadows Die Twice",
        description: "Precision action game set in late Sengoku Japan, following a shinobi seeking revenge.",
        image: steam(814380),
        igdbId: 101979,
        steamAppId: 814380,
        releaseDate: "2019-03-22",
        genres: ["Action", "Souls-like"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "God of War",
        description: "Kratos and his son Atreus journey through Norse mythology in this story-driven action adventure.",
        image: steam(1593500),
        igdbId: 38746,
        steamAppId: 1593500,
        releaseDate: "2022-01-14",
        genres: ["Action", "Adventure"],
        platforms: ["PC", "PlayStation 4", "PlayStation 5"],
      },
      {
        title: "Red Dead Redemption 2",
        description: "Epic tale of outlaw Arthur Morgan and the Van der Linde gang in a dying America.",
        image: steam(1174180),
        igdbId: 25076,
        steamAppId: 1174180,
        releaseDate: "2019-11-05",
        genres: ["Open World", "Adventure"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Doom Eternal",
        description: "Fast-paced first-person shooter where you tear through demonic hordes threatening Earth.",
        image: steam(782330),
        igdbId: 106238,
        steamAppId: 782330,
        releaseDate: "2020-03-20",
        genres: ["FPS", "Action"],
        platforms: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
      },
      {
        title: "Control",
        description: "Supernatural third-person action game set inside a brutalist federal building taken over by a paranatural force.",
        image: steam(870780),
        igdbId: 103298,
        steamAppId: 870780,
        releaseDate: "2019-08-27",
        genres: ["Action", "Shooter"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Disco Elysium",
        description: "Detective RPG with deep dialogue and skill checks, set in a surreal city haunted by ideology.",
        image: steam(632470),
        igdbId: 103467,
        steamAppId: 632470,
        releaseDate: "2019-10-15",
        genres: ["RPG", "Detective"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Outer Wilds",
        description: "Exploration mystery set in a handcrafted solar system stuck in a 22-minute time loop.",
        image: steam(753640),
        igdbId: 50105,
        steamAppId: 753640,
        releaseDate: "2019-05-28",
        genres: ["Adventure", "Exploration"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Celeste",
        description: "Precision platformer about climbing a mountain and confronting inner struggles.",
        image: steam(504230),
        igdbId: 66313,
        steamAppId: 504230,
        releaseDate: "2018-01-25",
        genres: ["Platformer", "Indie"],
        platforms: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
      },
      {
        title: "NieR: Automata",
        description: "Action RPG following androids in a proxy war against machine lifeforms, exploring themes of identity.",
        image: steam(524220),
        igdbId: 26762,
        steamAppId: 524220,
        releaseDate: "2017-03-17",
        genres: ["Action RPG", "Hack and Slash"],
        platforms: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
      },
      {
        title: "Persona 5 Royal",
        description: "JRPG about a group of Phantom Thieves who change the hearts of corrupt adults in modern Tokyo.",
        image: steam(1687950),
        igdbId: 106974,
        steamAppId: 1687950,
        releaseDate: "2022-10-21",
        genres: ["JRPG", "Turn-based"],
        platforms: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
      },
      {
        title: "Stardew Valley",
        description: "Farming simulation RPG where you build a life in the countryside, befriend villagers and explore caves.",
        image: steam(413150),
        igdbId: 22711,
        steamAppId: 413150,
        releaseDate: "2016-02-26",
        genres: ["Simulation", "RPG"],
        platforms: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Portal 2",
        description: "Physics-based puzzle game using portal mechanics, with a sharp co-op mode and dark humor.",
        image: steam(620),
        igdbId: 2369,
        steamAppId: 620,
        releaseDate: "2011-04-19",
        genres: ["Puzzle", "First-person"],
        platforms: ["PC", "PlayStation 3", "Xbox 360"],
      },
      {
        title: "Monster Hunter: World",
        description: "Action RPG where you hunt massive monsters across lush ecosystems and craft gear from their remains.",
        image: steam(582010),
        igdbId: 40949,
        steamAppId: 582010,
        releaseDate: "2018-08-09",
        genres: ["Action RPG", "Co-op"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Death Stranding",
        description: "Post-apocalyptic delivery game connecting isolated settlements across a hauntingly beautiful America.",
        image: steam(1190460),
        igdbId: 103267,
        steamAppId: 1190460,
        releaseDate: "2020-07-14",
        genres: ["Action", "Adventure"],
        platforms: ["PC", "PlayStation 4", "PlayStation 5"],
      },
      {
        title: "Forza Horizon 6",
        description: "The next evolution of open-world racing — explore a stunning new world behind the wheel of the world's greatest cars.",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2483190/27abb1584a118d50d0e3950fd48d557c51981db7/header.jpg?t=1778004187",
        igdbId: 299001,
        steamAppId: 2483190,
        releaseDate: "2025-10-31",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "Xbox Series X"],
      },
      {
        title: "Need for Speed Unbound",
        description: "Street racing in Lakeshore City with a bold graffiti-art visual style and high-stakes tournament runs.",
        image: steam(1846380),
        igdbId: 225522,
        steamAppId: 1846380,
        releaseDate: "2022-12-02",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "Forza Horizon 5",
        description: "Open-world racing set across a breathtaking and ever-evolving Mexico.",
        image: steam(1551360),
        igdbId: 154200,
        steamAppId: 1551360,
        releaseDate: "2021-11-09",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "Xbox One", "Xbox Series X"],
      },
      {
        title: "Forza Horizon 4",
        description: "Dynamic seasons transform an open-world Britain in this shared-world racing game.",
        image: steam(1293830),
        igdbId: 76882,
        steamAppId: 1293830,
        releaseDate: "2018-10-02",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "Xbox One"],
      },
      {
        title: "DiRT Rally 2.0",
        description: "Hardcore rally simulation across real-world locations with authentic car handling and co-driver notes.",
        image: steam(690790),
        igdbId: 103249,
        steamAppId: 690790,
        releaseDate: "2019-02-26",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
      {
        title: "Burnout Paradise Remastered",
        description: "Open-world arcade racer full of crashes, takedowns, and stunts across Paradise City.",
        image: steam(1238080),
        igdbId: 105049,
        steamAppId: 1238080,
        releaseDate: "2018-03-16",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
      },
      {
        title: "Wreckfest",
        description: "Demolition derby meets circuit racing — smash opponents into scrap in banger races.",
        image: steam(228380),
        igdbId: 17514,
        steamAppId: 228380,
        releaseDate: "2018-06-14",
        genres: ["Racing", "Sports"],
        platforms: ["PC", "PlayStation 4", "Xbox One"],
      },
    ];

    await Promise.all(
      seeds.map(async (seed) => {
        const existing = await this.games.findOne({ where: { igdbId: seed.igdbId } });
        return this.saveGame(seed, existing?.id);
      }),
    );
  }

  findCatalog(q?: string) {
    const query = this.games
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.genres", "genres")
      .leftJoinAndSelect("game.platforms", "platforms")
      .orderBy("game.releaseDate", "DESC");

    if (q?.trim()) {
      query.where("LOWER(game.title) LIKE :q", { q: `%${q.trim().toLowerCase()}%` });
    }

    return query.getMany();
  }

  async search(q: string) {
    const local = await this.findCatalog(q);
    const remote = await this.igdb.search(q).catch(() => []);
    const cached = await Promise.all(remote.map((game: any) => this.cacheIgdbGame(game)));
    const merged = new Map([...local, ...cached].map((game) => [game.igdbId || game.id, game]));
    return Array.from(merged.values());
  }

  async getById(id: string) {
    const game = await this.games.findOne({ where: { id }, relations: { genres: true, platforms: true } });
    if (!game) throw new NotFoundException("Game not found");
    return game;
  }

  async create(dto: UpsertGameDto) {
    return this.saveGame(dto);
  }

  async update(id: string, dto: UpsertGameDto) {
    await this.getById(id);
    return this.saveGame({ ...dto }, id);
  }

  async delete(id: string) {
    await this.games.delete(id);
    return { ok: true };
  }

  async findBySteamAppId(steamAppId: number) {
    return this.games.findOne({ where: { steamAppId }, relations: { genres: true, platforms: true } });
  }

  private async cacheIgdbGame(raw: any) {
    const existing = raw.igdbId
      ? await this.games.findOne({ where: { igdbId: raw.igdbId }, relations: { genres: true, platforms: true } })
      : null;
    if (existing) return existing;
    return this.saveGame({
      title: raw.title,
      description: raw.description,
      image: raw.image,
      igdbId: raw.igdbId,
      steamAppId: raw.steamAppId,
      releaseDate: raw.releaseDate,
      genres: raw.genres?.map((genre: any) => genre.name) || [],
      platforms: raw.platforms?.map((platform: any) => platform.name) || [],
    });
  }

  private async saveGame(dto: UpsertGameDto, id?: string) {
    const genres = await Promise.all((dto.genres || []).map((name) => this.findOrCreateGenre(name)));
    const platforms = await Promise.all((dto.platforms || []).map((name) => this.findOrCreatePlatform(name)));
    const game = this.games.create({ id, ...dto, genres, platforms });
    return this.games.save(game);
  }

  private async findOrCreateGenre(name: string) {
    const existing = await this.genres.findOne({ where: { name } });
    return existing || this.genres.save({ name });
  }

  private async findOrCreatePlatform(name: string) {
    const existing = await this.platforms.findOne({ where: { name } });
    return existing || this.platforms.save({ name });
  }
}
