import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCourseDialogComponent } from './choose-course-dialog.component';

describe('ChooseCourseDialogComponent', () => {
  let component: ChooseCourseDialogComponent;
  let fixture: ComponentFixture<ChooseCourseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseCourseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
