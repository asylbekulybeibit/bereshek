import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsListComponent } from './debts-list.component';

describe('DebtsListComponent', () => {
  let component: DebtsListComponent;
  let fixture: ComponentFixture<DebtsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
