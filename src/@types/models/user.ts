export interface Tokens {
  kind: string;
  accessToken: string;
  tokenSecret?: string;
}

export interface IUser {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  facebook: string;
  google: string;
  tokens: Tokens[];

  fullname: string;
  picture: string;
}
