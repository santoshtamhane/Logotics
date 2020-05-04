import { TestBed } from '@angular/core/testing';

import { DashboardAllService } from './dashboard-all.service';

describe('DashboardAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardAllService = TestBed.get(DashboardAllService);
    expect(service).toBeTruthy();
  });
});
