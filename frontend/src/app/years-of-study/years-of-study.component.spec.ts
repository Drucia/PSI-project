import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsOfStudyComponent } from './years-of-study.component';

describe('YearsOfStudyComponent', () => {
  let component: YearsOfStudyComponent;
  let fixture: ComponentFixture<YearsOfStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearsOfStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsOfStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
