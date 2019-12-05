import { TestBed } from '@angular/core/testing';

import { MudancaService } from './mudanca.service';

describe('MudancaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MudancaService = TestBed.get(MudancaService);
    expect(service).toBeTruthy();
  });
});
