import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorFormComponent } from './debtor-form.component';

describe('DebtorFormComponent', () => {
  let component: DebtorFormComponent;
  let fixture: ComponentFixture<DebtorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
