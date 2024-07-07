export interface AuthUseCase {
  createToken(uuid: string): Promise<string>;
}
