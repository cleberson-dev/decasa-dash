import { TestBed } from '@angular/core/testing';

import { FieldsOptionsService } from './fields-options.service';

describe('FieldsOptionsService', () => {
  let service: FieldsOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldsOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
