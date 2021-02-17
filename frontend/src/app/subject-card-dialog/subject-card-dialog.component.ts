import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Program } from '../models/program';
import { SubjectCard } from '../models/subject-card';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { RequireMatch } from '../common/matchers/require-match';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EffectCategory } from '../models/effect-category';
import { LearningEffect } from '../models/learning-effect';
import { Course } from '../models/course';
import { TranslateService } from '@ngx-translate/core';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-subject-card-dialog',
  templateUrl: './subject-card-dialog.component.html',
  styleUrls: ['./subject-card-dialog.component.scss']
})
export class SubjectCardDialogComponent implements OnInit {

  card: SubjectCard;
  static programCounter: number = -1;
  allProfessors: string[] = [];
  filteredProf: Observable<string[]>;
  professorCtrl = new FormControl();
  learningEffectForm: FormGroup;
  isPolish: boolean;

  EffectCategoryType = EffectCategory;

  @ViewChild('professorInput') professorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public originalCourse: Course, private _snackBar: MatSnackBar,
    private translate: TranslateService, private teacherService: TeacherService) 
  {
    let originalSubjectCard = originalCourse.subjectCard;
    this.card = JSON.parse(JSON.stringify(originalSubjectCard));
    this.professorCtrl.setValidators(RequireMatch);
    this.filteredProf = this.professorCtrl.valueChanges.pipe(
      startWith(null),
      map((prof: string | null) => prof ? this._filter(prof) : this.allProfessors.slice(0, 10)));
    this.resetLearnigEffectForm();

    this.isPolish = translate.currentLang.includes('pl');
    translate.onLangChange.subscribe((params) => { 
      this.isPolish = params['lang'].includes('pl');
    });
   }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProfessors.filter(p => p.toLowerCase().indexOf(filterValue) > -1);
  }

  ngOnInit(): void {
    this.teacherService.getAll().subscribe(
      data => { this.allProfessors = data },
      error => { this.openSnackBar("Error occour, when fetching data", "error") }
    );
  }

  getSumOfHoursFor(programs: Program[])
  {
    return programs.reduce((sum, current) => sum += current.hours, 0);
  }

  deleteProgramClicked(programs: Program[], idx: number)
  {
    programs.splice(idx, 1);
  }

  addNewProgramFor(programs: Program[])
  {
    programs.push(new Program({id: SubjectCardDialogComponent.programCounter--,
    subject: '', engSubject: ''}));
  }

  isFormValid()
  {
    return this.checkIfProgramsAreFilledAndHoursAreFine(this.card.exercises, this.originalCourse.sumHoursForExercises) &&
      this.checkIfProgramsAreFilledAndHoursAreFine(this.card.laboratories, this.originalCourse.sumHoursForLaboratories) &&
      this.checkIfProgramsAreFilledAndHoursAreFine(this.card.lectures, this.originalCourse.sumHoursForLectures) &&
      this.checkIfProgramsAreFilledAndHoursAreFine(this.card.projects, this.originalCourse.sumHoursForProjects) &&
      this.checkIfProgramsAreFilledAndHoursAreFine(this.card.seminaries, this.originalCourse.sumHoursForSeminaries) &&
      !SubjectCard.hasUniqueTitleError(this.card);
  }

  checkIfProgramsAreFilledAndHoursAreFine(programs: Program[], maxSum: number) {
    return programs.every(program => program.subject !== '' && program.engSubject !== '') && (this.getSumOfHoursFor(programs) <= maxSum);
  }

  checkIfProgramsSubjectsUniqueAndHours(programs: Program[], maxSum: number) {
    return (new Set(programs.map(p => p.subject))).size == programs.length && (this.getSumOfHoursFor(programs) == maxSum);
  }

  checkIfCardIsDone()
  {
    return this.checkIfProgramsSubjectsUniqueAndHours(this.card.exercises, this.originalCourse.sumHoursForExercises) &&
      this.checkIfProgramsSubjectsUniqueAndHours(this.card.laboratories, this.originalCourse.sumHoursForLaboratories) &&
      this.checkIfProgramsSubjectsUniqueAndHours(this.card.lectures, this.originalCourse.sumHoursForLectures) &&
      this.checkIfProgramsSubjectsUniqueAndHours(this.card.projects, this.originalCourse.sumHoursForProjects) &&
      this.checkIfProgramsSubjectsUniqueAndHours(this.card.seminaries, this.originalCourse.sumHoursForSeminaries) &&
      this.card.prerequisites !== '' && this.card.tools !== '' && this.card.aims !== '' && this.card.bibliography !== '' &&
      this.card.prerequisitesEng !== '' && this.card.toolsEng !== '' && this.card.aimsEng !== '' && this.card.bibliographyEng !== '' &&
      this.card.professors.length != 0 && this.card.learningEffects.length != 0;
  }

  changeStatusOfCard()
  {
    this.card.isDone = this.checkIfCardIsDone();
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  remove(prof: string): void {
    const index = this.card.professors.indexOf(prof);

    if (index >= 0) {
      this.card.professors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.card.professors.includes(event.option.viewValue))
    {
      this.translate.get("psi.proffessor-error-msg").subscribe(msg => {
        this.openSnackBar(msg, "OK");
      });
    }
    else {
      this.card.professors.push(event.option.viewValue);
      this.professorInput.nativeElement.value = '';
      this.professorCtrl.setValue(null);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getEffectsFor(category: EffectCategory)
  {
    return this.card.learningEffects.filter(e => e.category == category);
  }

  getEffectsWith(suffix: string)
  {
    return this.card.learningEffects.filter(e => e.code.search(suffix) > -1);
  }

  getExistingSuffixs()
  {
    return new Set(this.card.learningEffects.map(e => e.code.split('_')[0]));
  }

  addNewEffect()
  {
    let suffix = this.learningEffectForm.get('suffix').value;
    let desc = this.learningEffectForm.get('description').value;
    let descEng = this.learningEffectForm.get('descriptionEng').value;
    let category = this.learningEffectForm.get('category').value;
    let effects = this.getEffectsWith(suffix);
    let code = effects.length > 0 ? effects.map(e => Number(e.code.split('_')[1]))
      .reduce((max, curr) => max = max > curr ? max : curr) + 1 : 1;

    let newEffect = new LearningEffect({
      code: `${suffix}_${code < 10 ? "0": ""}${code}`,
      description: desc,
      descriptionEng: descEng,
      category: category
    });

    this.card.learningEffects.push(newEffect);
    this.resetLearnigEffectForm();
    this.learningEffectForm.patchValue({suffix: suffix, category: category});
  }

  resetLearnigEffectForm() {
    this.learningEffectForm = this.fb.group({
      suffix: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      descriptionEng: ['', Validators.required]
    });
  }

  removeEffect(effect: LearningEffect): void {
    const index = this.card.learningEffects.indexOf(effect);

    if (index >= 0) {
      this.card.learningEffects.splice(index, 1);
    }
  }

  checkIfSubjectsAreUnique(programs: Program[])
  {
    return new Set (programs.map(p => p.subject)).size == programs.length;
  }
}