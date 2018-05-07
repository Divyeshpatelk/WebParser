import { TestBed, inject } from '@angular/core/testing';

import { ParserServiceService } from './parser-service.service';

describe('ParserServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParserServiceService]
    });
  });

  it('should be created', inject([ParserServiceService], (service: ParserServiceService) => {
    expect(service).toBeTruthy();
  }));
});
