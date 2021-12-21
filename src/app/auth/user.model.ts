
export class User {
  constructor(
    public id: string,
    public email: string,
    private token: string,
    private tokenExpirationDate: Date
  ) { }

  get getToken() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this.token;
  }

  get getTokenDuration() {
    if (!this.getToken) {
      return 0;
    }
    // return 2000;
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
