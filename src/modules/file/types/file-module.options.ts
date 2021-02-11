export interface FileModuleOptions {
  uploadToken: Token;
}

interface Token {
  secret: string;
  expiresIn: number;
}
