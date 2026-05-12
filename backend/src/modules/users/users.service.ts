import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserProfile } from "./entities/user-profile.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserProfile) private readonly profiles: Repository<UserProfile>,
  ) {}

  async me(userId: string) {
    const user = await this.users.findOne({ where: { id: userId }, relations: { profile: true } });
    if (!user) throw new NotFoundException("User not found");
    const { password: _password, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.profiles.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException("Profile not found");
    Object.assign(profile, dto);
    return this.profiles.save(profile);
  }

  findAll() {
    return this.users.find({ relations: { profile: true }, order: { createdAt: "DESC" } });
  }

  async deleteUser(userId: string) {
    await this.users.delete(userId);
    return { ok: true };
  }
}
