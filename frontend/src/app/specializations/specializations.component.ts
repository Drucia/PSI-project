import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ptor } from 'protractor';
import { map } from 'rxjs/operators';
import { Degree } from '../models/degree.enum';
import { EducationProgram } from '../models/education-program';
import { Term } from '../models/term.enum';
import { Role } from '../models/user';
import { AuthService } from '../services/auth.service';
import { EducationProgramService } from '../services/education-program.service';

@Component({
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrls: ['./specializations.component.scss']
})
export class SpecializationsComponent implements OnInit {

  programs: EducationProgram[] = [];
  year: number;
  field: string;
  term: Term;
  degree: Degree;
  isPolish: boolean;

  constructor(private route: ActivatedRoute, private authService: AuthService, translate: TranslateService,
    private educationProgramService: EducationProgramService) {
    this.isPolish = translate.currentLang.includes('pl');
    translate.onLangChange.subscribe((params) => { 
      this.isPolish = params['lang'].includes('pl');
    });
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.year = +params['year'];
      this.field = params['field'];
      this.term = +params['term'];
      this.degree = +params['degreeId']
      this.educationProgramService.getAll().subscribe(
        data => {
            this.programs = this.programs.concat(data.filter(p => p.degree == this.degree &&
            p.year === this.year && p.term == this.term && this.field === (this.isPolish ? 
            p.field.name : p.field.engName)));
          },
        error => console.log(error)
      );

      this.educationProgramService.getAllWIP().subscribe(
        data => {
            this.programs = this.programs.concat(data.filter(p => p.degree == this.degree &&
            p.year === this.year && p.term == this.term && this.field === (this.isPolish ? 
            p.field.name : p.field.engName)));
          },
        error => console.log(error)
      );
    });
  }

  getNoWIPPrograms()
  {
    return this.programs.filter(program => !program.isWIP);
  }

  getWIPPrograms()
  {
    return this.programs.filter(program => program.isWIP);
  }

  public get isTeacher()
  {
    return this.authService.currentUserValue && this.authService.currentUserValue.role == Role.Teacher;
  }
}
