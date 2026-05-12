import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  name: string;

  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate: string | null;

  @Column({ name: "avatar_url", type: "varchar", nullable: true })
  avatarUrl: string | null;

  @Column({ name: "steam_id", type: "varchar", nullable: true })
  steamId: string | null;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
