import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiSecurity } from "@nestjs/swagger";
import { AuthGuard } from "../guard/Auth.guard";

export function UserAuth() {
  return applyDecorators(UseGuards(AuthGuard), ApiSecurity("accessToken"));
}
