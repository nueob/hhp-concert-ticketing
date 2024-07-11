import { ApiProperty } from "@nestjs/swagger";

export class CreateApiKeyResponseDTO {
  private readonly _accessToken: string;

  constructor(accessToken?: string) {
    this._accessToken = accessToken;
  }

  @ApiProperty()
  get accessToken(): string {
    return this._accessToken;
  }
}
