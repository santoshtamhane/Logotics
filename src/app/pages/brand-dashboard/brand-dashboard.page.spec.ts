import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandDashboardPage } from './brand-dashboard.page';

describe('BrandDashboardPage', () => {
  let component: BrandDashboardPage;
  let fixture: ComponentFixture<BrandDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
