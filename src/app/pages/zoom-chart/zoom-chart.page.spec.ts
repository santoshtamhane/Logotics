import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomChartPage } from './zoom-chart.page';

describe('ZoomChartPage', () => {
  let component: ZoomChartPage;
  let fixture: ComponentFixture<ZoomChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomChartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
