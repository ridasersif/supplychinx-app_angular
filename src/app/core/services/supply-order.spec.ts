import { TestBed } from '@angular/core/testing';

import { SupplyOrder } from './supply-order';

describe('SupplyOrder', () => {
  let service: SupplyOrder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyOrder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
