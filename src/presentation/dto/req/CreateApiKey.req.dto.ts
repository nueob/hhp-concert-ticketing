import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateApiKeyRequestDTO {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
