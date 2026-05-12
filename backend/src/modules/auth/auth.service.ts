import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { UserProfile } from "../users/entities/user-profile.entity";
import { User } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserProfile) private readonly profiles: Repository<UserProfile>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException("Email is already registered");

    const user = await this.users.save({
      email: dto.email.toLowerCase(),
      password: await bcrypt.hash(dto.password, 10),
      role: "user",
    });
    await this.profiles.save({ userId: user.id, name: dto.name, birthDate: null, avatarUrl: null, steamId: null });
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return this.issueToken(user);
  }

  async guest() {
    const password = randomUUID();
    const user = await this.users.save({
      email: `guest-${randomUUID()}@playd.local`,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });
    await this.profiles.save({ userId: user.id, name: "Guest", birthDate: null, avatarUrl: null, steamId: null });
    return this.issueToken(user);
  }

  private issueToken(user: User) {
    const safeUser = { id: user.id, email: user.email, role: user.role };
    return {
      token: this.jwt.sign({ sub: user.id, email: user.email, role: user.role }),
      user: safeUser,
    };
  }
}
