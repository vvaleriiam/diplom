import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AddLibraryDto, UpdateLibraryDto } from "./dto/library.dto";
import { LibraryStatus } from "./entities/library.entity";
import { LibraryService } from "./library.service";

@UseGuards(JwtAuthGuard)
@Controller("library")
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get()
  list(@CurrentUser() user: JwtUser, @Query("status") status?: LibraryStatus) {
    return this.library.findUserLibrary(user.sub, status);
  }

  @Post()
  add(@CurrentUser() user: JwtUser, @Body() dto: AddLibraryDto) {
    return this.library.add(user.sub, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: JwtUser, @Param("id") id: string, @Body() dto: UpdateLibraryDto) {
    return this.library.update(user.sub, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.library.remove(user.sub, id);
  }
}
