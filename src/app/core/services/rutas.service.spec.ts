import { TestBed } from '@angular/core/testing';

import { RutasService } from './core/services/rutas.service';

describe('RutasService', () => {
  let service: RutasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
