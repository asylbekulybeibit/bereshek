import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorDetailsComponent } from './debtor-details.component';

describe('DebtorDetailsComponent', () => {
  let component: DebtorDetailsComponent;
  let fixture: ComponentFixture<DebtorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
