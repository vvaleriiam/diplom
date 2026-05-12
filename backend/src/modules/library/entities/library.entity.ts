import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Game } from "../../games/entities/game.entity";
import { User } from "../../users/entities/user.entity";

export type LibraryStatus = "playing" | "finished" | "abandoned";

@Entity("libraries")
@Unique(["userId", "gameId"])
export class Library {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "game_id" })
  gameId: string;

  @ManyToOne(() => User, (user) => user.library, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Game, (game) => game.libraryEntries, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Column()
  status: LibraryStatus;

  @Column({ default: "manual" })
  source: string;

  @Column({ name: "finished_at", nullable: true, type: "varchar" })
  finishedAt: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
