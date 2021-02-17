import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll()
  {
    let token = this.authService.currentUserValue.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<string[]>(`${environment.apiUrl}/api/employee`, {headers: headers});
  }
}
