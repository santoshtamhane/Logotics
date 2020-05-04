import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBPage } from './dashboard-b.page';

describe('DashboardBPage', () => {
  let component: DashboardBPage;
  let fixture: ComponentFixture<DashboardBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
