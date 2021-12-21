import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  // private userIsAuth = false; // set to true because need to login with every refresh
  private user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get getUserIsAuth() {
    return this.user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.getToken;
        } else {
          return false;
        }
      })
    );
  }

  get getUserId() {
    return this.user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Storage.get({
      key: 'authData',
    }))
      .pipe(
        map(storedData => {
          if (!storedData || !storedData.value) {
            return null;
          }
          const parsedData = JSON.parse(
            storedData.value
          ) as {
            userId: string; token: string; tokenExpDate: string; email: string;
          };
          const expTime = new Date(parsedData.tokenExpDate);
          if (expTime <= new Date()) {
            return null;
          }
          const user = new User(
            parsedData.userId,
            parsedData.email,
            parsedData.token,
            expTime
          );
          return user;
        }),
        tap(user => {
          if (user) {
            this.user.next(user);
            this.autoLogout(user.getTokenDuration);
          }
        }),
        map(user => !!user)
      );
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAuthKey}`,
      { email, password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAuthKey}`,
      { email, password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.user.next(null);
    Storage.remove({ key: 'authData' });
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this.user.next(user);
    this.autoLogout(user.getTokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(userId: string, token: string, tokenExpDate: string, email: string) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpDate,
      email
    });
    Storage.set({
      key: 'authData',
      value: data
    });
  };
}
