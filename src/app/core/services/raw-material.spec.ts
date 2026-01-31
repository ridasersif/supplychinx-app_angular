import { TestBed } from '@angular/core/testing';

import { RawMaterial } from './raw-material';

describe('RawMaterial', () => {
  let service: RawMaterial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawMaterial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
