import { TestBed } from '@angular/core/testing';

import { LojistasService } from './lojistas.service';

describe('LojistasService', () => {
  let service: LojistasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LojistasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
