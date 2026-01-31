import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialForm } from './raw-material-form';

describe('RawMaterialForm', () => {
  let component: RawMaterialForm;
  let fixture: ComponentFixture<RawMaterialForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
