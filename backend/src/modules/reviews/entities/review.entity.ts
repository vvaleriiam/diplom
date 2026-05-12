import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Game } from "../../games/entities/game.entity";
import { User } from "../../users/entities/user.entity";

@Entity("reviews")
@Unique(["userId", "gameId"])
@Check(`"rating" >= 1 AND "rating" <= 10`)
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "game_id" })
  gameId: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Game, (game) => game.reviews, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Column()
  rating: number;

  @Column({ type: "text", nullable: true })
  body: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
