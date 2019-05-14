import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.httpClient.post('http://localhost:3000/api/v1/users/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.httpClient.post<{token: string}>('http://localhost:3000/api/v1/users/login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      this.authStatusListener.next(true);
    });
  }
}
