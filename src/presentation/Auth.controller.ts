import { Body, Controller, Post } from "@nestjs/common";
import { CreateApiKeyRequestDTO } from "./dto/req/CreateApiKey.req.dto";
import { CreateApiKeyResponseDTO } from "./dto/res/CreateApiKey.res.dto";
import { AuthFacade } from "../application/Auth.facade";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post()
  async createApiKey(
    @Body() createApiKeyRequestDTO: CreateApiKeyRequestDTO,
  ): Promise<CreateApiKeyResponseDTO> {
    return new CreateApiKeyResponseDTO(
      await this.authFacade.createToken(createApiKeyRequestDTO.uuid),
    );
  }
}
