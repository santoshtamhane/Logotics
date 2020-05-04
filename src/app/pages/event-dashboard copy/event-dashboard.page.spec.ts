import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDashboardPage } from './event-dashboard.page';

describe('EventDashboardPage', () => {
  let component: EventDashboardPage;
  let fixture: ComponentFixture<EventDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
