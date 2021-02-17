import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-choose-course-dialog',
  templateUrl: './choose-course-dialog.component.html',
  styleUrls: ['./choose-course-dialog.component.scss']
})
export class ChooseCourseDialogComponent implements OnInit {

  selectedCourse;
  isPolish: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public courses: Course[], translate: TranslateService) {
    this.isPolish = translate.currentLang.includes('pl');
    translate.onLangChange.subscribe((params) => { 
      this.isPolish = params['lang'].includes('pl');
    });
  }

  ngOnInit(): void {
  }

}
