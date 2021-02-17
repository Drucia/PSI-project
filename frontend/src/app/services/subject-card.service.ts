import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Link } from '../models/link';

@Injectable({
  providedIn: 'root'
})
export class SubjectCardService {

  constructor(private http: HttpClient) { 
  }

  getAllFor(programId: string) {
    return this.http.get<Link[]>(`${environment.apiUrl}/api/educationProgram/${programId}/pdf`);
  }
}
