import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Platform } from "./platform.entity";
import { Library } from "../../library/entities/library.entity";
import { Review } from "../../reviews/entities/review.entity";

@Entity("games")
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", nullable: true })
  image: string | null;

  @Column({ name: "igdb_id", type: "int", unique: true, nullable: true })
  igdbId: number | null;

  @Column({ name: "steam_app_id", type: "int", nullable: true })
  steamAppId: number | null;

  @Column({ name: "release_date", type: "date", nullable: true })
  releaseDate: string | null;

  @ManyToMany(() => Genre, (genre) => genre.games, { cascade: true })
  @JoinTable({
    name: "game_genres",
    joinColumn: { name: "game_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" },
  })
  genres: Genre[];

  @ManyToMany(() => Platform, (platform) => platform.games, { cascade: true })
  @JoinTable({
    name: "game_platforms",
    joinColumn: { name: "game_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "platform_id", referencedColumnName: "id" },
  })
  platforms: Platform[];

  @OneToMany(() => Library, (library) => library.game)
  libraryEntries: Library[];

  @OneToMany(() => Review, (review) => review.game)
  reviews: Review[];
}
