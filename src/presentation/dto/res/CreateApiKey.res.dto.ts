export class CreateApiKeyResponseDTO {
  private readonly _accessToken: string;

  constructor(accessToken?: string) {
    this._accessToken = accessToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }
}
