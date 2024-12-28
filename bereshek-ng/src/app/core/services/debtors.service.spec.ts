import { TestBed } from '@angular/core/testing';

import { DebtorsService } from './debtors.service';

describe('DebtorsService', () => {
  let service: DebtorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
