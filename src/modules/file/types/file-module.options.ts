export interface FileModuleOptions {
  accessToken: Token;
}

interface Token {
  secret: string;
  expiresIn: number;
}
