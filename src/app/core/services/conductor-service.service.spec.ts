import { TestBed } from '@angular/core/testing';

import { ConductorServiceService } from './core/services/conductor-service.service';

describe('ConductorServiceService', () => {
  let service: ConductorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConductorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
