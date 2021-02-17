import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  users = new Map<Role, any>([
    [Role.Student, {email: "user@user.com", password: "userPassworD1!"}],
    [Role.Teacher, {email: "admin@admin.com", password: "adminPassworD1!"}],
    [Role.Error, {email: "error", password: ""}]
  ]);

  constructor(private http: HttpClient) { }

  loginAs(role: Role)
  {
    const user = this.users.get(role);
    return this.login(user.email, user.password);
  }

  private login(email: string, password: string)
  {
    return this.http.post<any>(`${environment.apiUrl}/api/user/login`, {email: email, password: password});
  }

  private logout(email: string)
  {
    return this.http.post<any>(`${environment.apiUrl}/api/user/logout`, {email: email});
  }
}
