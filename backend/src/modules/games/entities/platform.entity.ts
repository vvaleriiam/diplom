import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity("platforms")
export class Platform {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ name: "igdb_id", type: "int", nullable: true })
  igdbId: number | null;

  @ManyToMany(() => Game, (game) => game.platforms)
  games: Game[];
}
