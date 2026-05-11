import { TestBed } from '@angular/core/testing';

import { EditPerfilService } from './edit-perfil.service';

describe('EditPerfilService', () => {
  let service: EditPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
