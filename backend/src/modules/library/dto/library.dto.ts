import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";
import { LibraryStatus } from "../entities/library.entity";

export class AddLibraryDto {
  @IsUUID()
  gameId: string;

  @IsIn(["playing", "finished", "abandoned"])
  status: LibraryStatus;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateLibraryDto {
  @IsIn(["playing", "finished", "abandoned"])
  status: LibraryStatus;

  @IsOptional()
  @IsString()
  finishedAt?: string | null;
}
