import { TestBed } from '@angular/core/testing';

import { SubjectCardService } from './subject-card.service';

describe('SubjectCardService', () => {
  let service: SubjectCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
