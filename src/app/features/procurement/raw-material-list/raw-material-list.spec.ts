import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialList } from './raw-material-list';

describe('RawMaterialList', () => {
  let component: RawMaterialList;
  let fixture: ComponentFixture<RawMaterialList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
