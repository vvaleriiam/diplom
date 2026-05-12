import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ImportSteamDto } from "./dto/import-steam.dto";
import { SteamService } from "./steam.service";

@UseGuards(JwtAuthGuard)
@Controller("steam")
export class SteamController {
  constructor(private readonly steam: SteamService) {}

  @Post("import")
  import(@CurrentUser() user: JwtUser, @Body() dto: ImportSteamDto) {
    return this.steam.import(user.sub, dto);
  }
}
