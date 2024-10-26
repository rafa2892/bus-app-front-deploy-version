import { TestBed } from '@angular/core/testing';

import { RutaServiceService } from './ruta-service.service';

describe('RutaServiceService', () => {
  let service: RutaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
