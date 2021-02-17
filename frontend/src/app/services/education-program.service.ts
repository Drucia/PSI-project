import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course';
import { Degree } from '../models/degree.enum';
import { EducationProgram } from '../models/education-program';
import { Program } from '../models/program';
import { SubjectCard } from '../models/subject-card';
import { Term } from '../models/term.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EducationProgramService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAll()
  {
    return this.http.get<EducationProgram[]>(`${environment.apiUrl}/api/educationProgram`);
  }

  getAllWIP()
  {
    let token = this.authService.currentUserValue.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<EducationProgram[]>(`${environment.apiUrl}/api/educationProgram/wip`, {headers: headers});
  }

  getProgram(programId: string) {
    let token = this.authService.currentUserValue.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<EducationProgram>(`${environment.apiUrl}/api/educationProgram/${programId}`, {headers: headers});
  }

  save(educationProgram: EducationProgram) {
    let token = this.authService.currentUserValue.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    educationProgram.isWIP = false;
    
    return this.http.put<EducationProgram>(`${environment.apiUrl}/api/educationProgram/${educationProgram.id}/update`,
      educationProgram, {headers: headers});
  }

  saveAsWIP(educationProgram: EducationProgram) {
    let token = this.authService.currentUserValue.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<EducationProgram>(`${environment.apiUrl}/api/educationProgram/${educationProgram.id}/update`,
      educationProgram, {headers: headers});
  }
}
