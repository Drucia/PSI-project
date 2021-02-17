import { Component, OnInit } from '@angular/core';
import { Degree } from '../models/degree.enum';
import { Role } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-degrees-of-study',
  templateUrl: './degrees-of-study.component.html',
  styleUrls: ['./degrees-of-study.component.scss']
})
export class DegreesOfStudyComponent implements OnInit {
  degree: Degree;
  DegreeType = Degree;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  public get isTeacher()
  {
    return this.authService.currentUserValue && this.authService.currentUserValue.role == Role.Teacher;
  }
}
