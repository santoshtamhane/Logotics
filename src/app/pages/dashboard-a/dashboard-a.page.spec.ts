import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAPage } from './dashboard-a.page';

describe('DashboardAPage', () => {
  let component: DashboardAPage;
  let fixture: ComponentFixture<DashboardAPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
