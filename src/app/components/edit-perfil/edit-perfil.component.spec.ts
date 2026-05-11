import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPerfilComponent } from './edit-perfil.component';

describe('EditPerfilComponent', () => {
  let component: EditPerfilComponent;
  let fixture: ComponentFixture<EditPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPerfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPerfilComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
