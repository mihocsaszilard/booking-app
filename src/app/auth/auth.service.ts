import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToke: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIsAuth = false; // set to true because need to login with every refresh
  private userId = null;

  get getUserIsAuth() {
    return this.userIsAuth;
  }

  get getUserId() {
    return this.userId;
  }

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAuthKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAuthKey}`,
      { email, password }
    );
  }

  logout() {
    this.userIsAuth = false;
  }
}
