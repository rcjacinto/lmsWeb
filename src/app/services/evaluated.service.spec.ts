import { TestBed } from '@angular/core/testing';

import { EvaluatedService } from './evaluated.service';

describe('EvaluatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluatedService = TestBed.get(EvaluatedService);
    expect(service).toBeTruthy();
  });
});
