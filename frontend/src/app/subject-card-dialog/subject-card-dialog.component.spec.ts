import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCardDialogComponent } from './subject-card-dialog.component';

describe('SubjectCardDialogComponent', () => {
  let component: SubjectCardDialogComponent;
  let fixture: ComponentFixture<SubjectCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
