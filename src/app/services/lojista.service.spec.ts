import { TestBed } from '@angular/core/testing';

import { LojistaService } from './lojista.service';

describe('LojistaService', () => {
  let service: LojistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LojistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
