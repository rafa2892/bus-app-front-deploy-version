import { TestBed } from '@angular/core/testing';

import { GlobalUtilsService } from './global-utils.service';

describe('GlobalUtilsService', () => {
  let service: GlobalUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
