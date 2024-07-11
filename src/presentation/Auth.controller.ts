import { Body, Controller, Post } from "@nestjs/common";
import { CreateApiKeyRequestDTO } from "./dto/req/CreateApiKey.req.dto";
import { CreateApiKeyResponseDTO } from "./dto/res/CreateApiKey.res.dto";
import { AuthFacade } from "../application/Auth.facade";
import { ApiExtraModels, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthDocs, AuthErrorResponse } from "./swaggerDocs/AuthDocs";

@ApiTags("인증 API")
@Controller("/auth")
@ApiExtraModels(CreateApiKeyRequestDTO, CreateApiKeyResponseDTO)
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post()
  @AuthDocs()
  @AuthErrorResponse()
  @ApiOkResponse({ type: CreateApiKeyResponseDTO })
  async createApiKey(
    @Body() createApiKeyRequestDTO: CreateApiKeyRequestDTO,
  ): Promise<CreateApiKeyResponseDTO> {
    return new CreateApiKeyResponseDTO(
      await this.authFacade.createToken(createApiKeyRequestDTO.uuid),
    );
  }
}
