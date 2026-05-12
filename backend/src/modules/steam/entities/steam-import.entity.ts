import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("steam_imports")
export class SteamImport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User, (user) => user.steamImports, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "imported_amount", default: 0 })
  importedAmount: number;

  @Column({ name: "failed_import", default: 0 })
  failedImport: number;

  @Column()
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
