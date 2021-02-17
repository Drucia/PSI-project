import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Degree } from '../models/degree.enum';
import { EducationProgram } from '../models/education-program';
import { Term } from '../models/term.enum';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { SubjectCard } from '../models/subject-card';
import { MatDialog } from '@angular/material/dialog';
import { SubjectCardDialogComponent } from '../subject-card-dialog/subject-card-dialog.component';
import { Field } from '../models/field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequireMatch } from '../common/matchers/require-match';
import { Specialization } from '../models/specialization';
import { Course } from '../models/course';
import { ChooseCourseDialogComponent } from './choose-course-dialog/choose-course-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EducationProgramService } from '../services/education-program.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'protractor';
import { ThrowStmt } from '@angular/compiler';

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
  selector: 'app-education-program',
  templateUrl: './education-program.component.html',
  styleUrls: ['./education-program.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class EducationProgramComponent implements OnInit {
  TermType = Term;
  degreeChips = [
    {name: "I", state: true, degree: Degree.Bachelor},
    {name: "II", state: false, degree: Degree.Master},
  ];

  isPolish: boolean;
  timetable: string;
  loading: boolean = true;
  updating: boolean = false;

  educationProgram: EducationProgram = EducationProgram.create();
  educationProgramOrg: EducationProgram;
  isNewProgram: boolean = true;

  minDate = new Date(new Date().getFullYear(), 0 , 1);
  nextYear: number;
  educationProgramForm: FormGroup;

  fields: Field[] = Field.getSimpleListOfFileds();
  filteredFields: Observable<Field[]>;
  filteredSpecializations: Observable<Specialization[]>;
  selectedSemester: number = this.getAllSemesters().length == 0 ? null : this.getAllSemesters()[0];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private route: ActivatedRoute,
    private translate: TranslateService,  private cdref: ChangeDetectorRef,
    private educationProgramService: EducationProgramService, private router: Router,
    private _snackBar: MatSnackBar) { 
      this.isPolish = translate.currentLang.includes('pl');
      this.translate.onLangChange.subscribe((params) => { 
        this.isPolish = params['lang'].includes('pl');
      });
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.educationProgramForm.get('date').value;
    ctrlValue.year(normalizedYear.year());
    this.educationProgramForm.patchValue({date: ctrlValue});
    this.nextYear = normalizedYear.year() + 1;
    datepicker.close();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.route.params.pipe(map(p => p.id)).subscribe(id => {
      if (id) {
        this.educationProgramService.getProgram(id).subscribe(
          data => {
            this.educationProgramOrg = data;
            this.educationProgram = JSON.parse(JSON.stringify(this.educationProgramOrg));
            this.isNewProgram = false;
            console.log(this.educationProgram)
            this.prepareTimetable();
            this.setForms();
            this.loading = false;
          },
          error => console.log(error)
        );
      } else {
        this.setForms();
        this.loading = false;
      }
    });
  }

  setForms() {
    this.setEducationProgramForm();

    this.filteredFields = this.educationProgramForm.controls['field'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.isPolish ? value.name : value.engName),
      map(name => name ? this._filter(name) : this.fields.slice(0,10))
    );

    this.filteredSpecializations = this.educationProgramForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.isPolish ? value.name : value.engName),
      map(name => name ? this._filterSpec(name) : 
      this.fields.map(f => f.specializations).reduce((list, spec) => list.concat(spec), [])));
  }

  setEducationProgramForm() {
      this.educationProgramForm = this.fb.group({
        date: [this.isNewProgram ? moment() : moment().year(this.educationProgram.year)],
        field: [this.isNewProgram ? '' : this.educationProgram.field, [Validators.required, RequireMatch]],
        specialization: [this.isNewProgram ? '' : this.educationProgram.specialization, RequireMatch],
        term: [this.isNewProgram ? '' : this.educationProgram.term, Validators.required]
      });;
      
      this.nextYear = this.isNewProgram ? this.minDate.getFullYear() + 1 : this.educationProgram.year + 1;
      
      if (!this.isNewProgram){
        this.educationProgramForm.controls['field'].disable();
        this.educationProgramForm.controls['specialization'].disable();
        this.educationProgramForm.controls['date'].disable();
        this.educationProgramForm.controls['term'].disable();
  
        this.degreeChips.forEach(chip => chip.state = chip.degree === this.educationProgram.degree);
      }
  }

  private _filter(name: any): any {
    const filterValue = name.toLowerCase();

    return this.fields.filter(field => (this.isPolish ? field.name : field.engName).toLowerCase().indexOf(filterValue) > -1);
  }

  private _filterSpec(name: any): any {
    const filterValue = name.toLowerCase();
    return this.educationProgramForm.get('field').value.specializations.filter(spec => (this.isPolish ? spec.name : spec.engName).toLowerCase().indexOf(filterValue) > -1);
  }

  get f() { return this.educationProgramForm.controls; }

  chosenChip(idx: number)
  {
    if (this.isNewProgram) {
      let toUnselect = (idx - 1) * -1;
      this.degreeChips[toUnselect].state = false;
      this.degreeChips[idx].state = true;
    }
  }

  clearField()
  {
    this.educationProgramForm.patchValue({ field: '' });
  }

  clearSpecialization()
  {
    this.educationProgramForm.patchValue({ specialization: '' });
  }

  canSpecializationBeChosen()
  {
    return this.educationProgramForm.get('field').valid || !this.isNewProgram;
  }

  addSpecialization()
  {
    // TODO
  }

  addField()
  {
    // TODO
  }

  editCardOf(course: Course)
  {
    this.openDialog(course);
  }

  deleteCardOf(course: Course)
  {
    let idx = this.educationProgram.courses.indexOf(course);
    this.educationProgram.courses[idx].subjectCard = null;
  }

  openDialog(course: Course) {
    const dialogRef = this.dialog.open(SubjectCardDialogComponent, {data: course});
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        course.subjectCard = result;
      this.prepareTimetable();
    });
  }

  displayField(field: Field): string {
    return field.name;
  }

  displayEngField(field: Field): string {
    return field.engName;
  }

  displaySpec(specialization: Specialization): string {
    return specialization.name;
  }

  displayEngSpec(specialization: Specialization): string {
    return specialization.engName;
  }

  checkIfAllIsDone()
  {
    return this.educationProgram.courses.every(course => course.subjectCard) && 
      this.getAllCards().every(card => card.isDone);
  }

  getAllSemesters()
  {
    return Array.from(new Set(this.educationProgram.courses.map(course => course.semester))).sort();
  }

  getAllCards()
  {
    return this.educationProgram.courses.filter(course => course.subjectCard).map(c => c.subjectCard);
  }

  addNewCard(selectedSemester: number)
  {
    let coursesToDo = this.getCoursesToDoFor(selectedSemester);
    if (coursesToDo.length !== 0 ) {
      const dialogRef = this.dialog.open(ChooseCourseDialogComponent, {data: coursesToDo});
      dialogRef.afterClosed().subscribe(result => {
        if (result)
        {
          result.subjectCard = SubjectCard.create();
          this.editCardOf(result)
        }
      });
    }
  }

  getCoursesToDoFor(semester: number)
  {
    return this.educationProgram.courses.filter(c => c.semester == semester && !c.subjectCard);
  }

  getCoursesWithCards()
  {
    return this.educationProgram.courses.filter(c => c.subjectCard);
  }

  prepareTimetable() {
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    
    let grouppedBySem = groupBy(this.educationProgram.courses.map(course => {
      return {semester: course.semester,
      name: course.name,
      engName: course.engName,
      isSubjectCardCreated: course.subjectCard != null
    }}), 'semester');

    this.timetable = JSON.stringify(grouppedBySem, null, 4)
      .replace(/\n/g, '<br/>');;
  }

  onCancelClicked()
  {
    this.dialog.open(ConfirmDialogComponent);
  }

  checkIfHasError(card: SubjectCard)
  {
    return SubjectCard.hasUniqueTitleError(card);
  }

  saveEducationProgramAsWIP()
  {
    this.updating = true;
    this.educationProgramService.saveAsWIP(this.educationProgram).subscribe(
      data => {
        this.updating = false;
        this.educationProgram = data;
        this.openSnackBar("Successfully saved education program", "OK", "success");
      },
      error => {
        this.updating = false;
        this.openSnackBar("Error with saving data. Please try again.", "OK", "error")
      }
    );
  }

  saveEducationProgram()
  {
    this.updating = true;
    this.educationProgramService.save(this.educationProgram).subscribe(
      data => {
        this.updating = false;
        this.openSnackBar("Successfully saved education program", "OK", "success");
        this.router.navigate([`educationprograms/degrees/${this.educationProgram.degree}`])
      },
      error => {
        this.updating = false;
        this.openSnackBar("Error with saving data. Please try again.", "OK", "error");
      }
    );
  }

  openSnackBar(message: string, action: string, cssClass: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: [cssClass, "snackbar"]
    });
  }
}
