import { Component, OnInit } from '@angular/core';
import { EducationProgram } from '../models/education-program';
import { Term } from '../models/term.enum';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Degree } from '../models/degree.enum';
import { TranslateCacheService } from 'ngx-translate-cache';
import { EducationProgramService } from '../services/education-program.service';
const moment = _rollupMoment || _moment;


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-years-of-study',
  templateUrl: './years-of-study.component.html',
  styleUrls: ['./years-of-study.component.scss'],
  providers: [    
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },

  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class YearsOfStudyComponent implements OnInit {

  termChips = [
    {name: "", state: true, term: Term.Summer},
    {name: "", state: false, term: Term.Winter},
  ];

  programs: EducationProgram[] = [];
  degree: Degree;

  year: FormControl = new FormControl(moment());
  nextYear: number;
  isPolish: boolean;

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.year.value;
    ctrlValue.year(normalizedYear.year());
    this.year.setValue(ctrlValue);
    this.nextYear = normalizedYear.year() + 1;
    datepicker.close();
  }

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router,
    private translate: TranslateService, private educationProgramService: EducationProgramService) {
      this.translate.onLangChange.subscribe((params) => { 
        this.setTerms();
        this.changeLanguage();
      });
      this.setTerms();
      this.changeLanguage();
    }

  setTerms() 
  {
    this.translate.get(["psi.summer", "psi.winter"]).subscribe(terms => {
      this.termChips[0].name = terms["psi.summer"].toUpperCase();
      this.termChips[1].name = terms["psi.winter"].toUpperCase();
    });
  }

  changeLanguage()
  {
      this.isPolish = this.translate.currentLang.includes('pl');
  }

  ngOnInit(): void {
    this.route.params.pipe(map(d => d.degreeId)).subscribe((degree: Degree) => {
      this.degree = +degree;
      this.educationProgramService.getAll().subscribe(
        data => this.programs = this.programs.concat(data.filter(program => program.degree == this.degree)),
      );
      if (this.isTeacher) {
        this.educationProgramService.getAllWIP().subscribe(
          data => this.programs = this.programs.concat(data.filter(program => program.degree == this.degree)),
        );
      }
    });

    const ctrlValue = this.year.value;
    ctrlValue.year(this.getMaxYear.getFullYear());
    this.year.setValue(ctrlValue);
    this.nextYear = this.year.value.year() + 1;
  }

  chosenChip(idx: number)
  {
    let toUnselect = (idx - 1) * -1;
    this.termChips[toUnselect].state = false;
    this.termChips[idx].state = true;
  }

  getFieldsOfChosenYear()
  {
    return new Set(this.programs.filter(program => program.year == this.year.value.year() && program.term == this.selectedTerm).map(
      p => this.isPolish ? p.field.name : p.field.engName));
  }

  getNoWIPFieldsOfChosenYear()
  {
    return new Set(this.programs.filter(program => program.year == this.year.value.year() && program.term == this.selectedTerm && !program.isWIP).map(p => 
      this.isPolish ? p.field.name : p.field.engName));
  }

  get getMaxYear()
  {
    return this.programs.length != 0 ? new Date(this.programs.sort((a: EducationProgram, b: EducationProgram) => a.year - b.year)[0].year, 0, 1)
    : new Date(new Date().getFullYear(), 0, 1);
  }

  get getMinYear()
  {
    return this.programs.length != 0 ? new Date(this.programs.sort((a: EducationProgram, b: EducationProgram) => b.year - a.year)[0].year, 0, 1)
    : new Date(new Date().getFullYear(), 0, 1);
  }

  public get isTeacher()
  {
    return this.authService.currentUserValue && this.authService.currentUserValue.role == Role.Teacher;
  }

  get selectedTerm()
  {
    return this.termChips.filter(t => t.state)[0].term;
  }

  showProgram(program: EducationProgram)
  {
    this.router.navigate([`/educationprograms/degrees/${this.degree}/artifacts`, program.id]);
  }

  onCardClicked(field: string)
  {
    let programsOfField = this.programs.filter(program => program.year == this.year.value.year() && program.term == this.selectedTerm
      && (this.isPolish ? program.field.name : program.field.engName === field));
    let hasSpecialization = programsOfField[0].specialization != null;
    
    if (!hasSpecialization && !programsOfField[0].isWIP)
      this.showProgram(programsOfField[0]);
    else if (hasSpecialization)
      this.router.navigate([`/educationprograms/degrees/${this.degree}/specializations`, this.year.value.year(), this.selectedTerm, field]);
    else
      this.router.navigate([`/educationprograms/degrees/${this.degree}/edit`, programsOfField[0].id]); 
  }

  hasFieldNoSpecializationsAndIsWIP(field: string)
  {
    return this.programs.filter(program => program.year == this.year.value.year() && program.term == this.selectedTerm && (this.isPolish ? program.field.name : program.field.engName) == field && !program.specialization
      && program.isWIP).length != 0;
  }
}
