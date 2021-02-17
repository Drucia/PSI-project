import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, User } from '../models/user';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private router: Router, private loginService: LoginService) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(role: Role) {
    return this.loginService.loginAs(role).pipe(map(
      userData => {
          let user: User = userData;
          user.role = userData.isAdmin ? Role.Teacher : Role.Student;
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUserValue));
          return user;
      }
    ));
  }

  logout(redirect: string) {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate([redirect]);
  }
}
