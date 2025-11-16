import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../../shared/models/Role';
import { Observable } from 'rxjs';
import { PROFILE_URL, ROLE_URL } from '../../shared/constants/urls';
import { Profile, ProfileLogin } from '../../shared/models/Profile';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${ROLE_URL}`);
  }

  signup(profile: Profile): Observable<HttpResponse<Profile>> {
    return this.http.post<Profile>(`${PROFILE_URL}`, profile, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    });
  }

  login(credentials: ProfileLogin): Observable<string> {
    return this.http.post(`${PROFILE_URL}/authenticate`, credentials, {
      responseType: 'text'
    });
  }
}
