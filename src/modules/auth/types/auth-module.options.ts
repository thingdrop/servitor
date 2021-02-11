export interface AuthModuleOptions {
  secret: string;
}

interface Token {
  keyName: string;
  secret: string;
  expiresIn: number;
  expiresInExtended?: number;
}
