import { TestBed } from '@angular/core/testing';

import { RegistrosAuditoriaService } from './registros-auditoria.service';

describe('RegistrosAuditoriaService', () => {
  let service: RegistrosAuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrosAuditoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
