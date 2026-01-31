import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyOrderForm } from './supply-order-form';

describe('SupplyOrderForm', () => {
  let component: SupplyOrderForm;
  let fixture: ComponentFixture<SupplyOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyOrderForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyOrderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
