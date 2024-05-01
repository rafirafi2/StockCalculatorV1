import { TestBed } from '@angular/core/testing';

import { StockdataService } from './stockdata.service';

describe('StockdataService', () => {
  let service: StockdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
