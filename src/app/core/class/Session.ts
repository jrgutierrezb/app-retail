import { User } from "./User";

export class Session {
  public token: string | null = null;
  public user: User | null = null;
  public menus: any[] | null = null

  constructor(token: string, user: User, menus: any) {
      this.token = token;
      this.user = user;
      this.menus = menus;
  }
}