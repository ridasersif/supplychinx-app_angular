import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyOrderList } from './supply-order-list';

describe('SupplyOrderList', () => {
  let component: SupplyOrderList;
  let fixture: ComponentFixture<SupplyOrderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyOrderList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyOrderList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
