import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './perfil.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  private router = inject(Router);
  constructor(private perfilService: PerfilService) {}

  Nombre = signal('');
  Apellidos = signal('');
  Telefono = signal('');
  Email = signal('');
  Direccion = signal('');
  Birthdate = signal('');

  ngOnInit() {
    if (!localStorage.getItem('Email')) {
      console.log('No email found in localStorage. Redirecting to login page.');
      this.router.navigate(['/login']);
      return;
    } else {
      this.perfilService.getByEmail(localStorage.getItem('Email') || '').subscribe(
        (response: any) => {
          // Reset form
          this.Nombre.set(response.Nombre || 'ERROR');
          this.Apellidos.set(response.Apellidos || 'ERROR');
          this.Telefono.set(response.Telefono || 'ERROR');
          this.Email.set(response.Email || 'ERROR');
          this.Direccion.set(response.Direccion || 'ERROR');
          this.Birthdate.set(response.Birthdate || 'ERROR');
        },
        (error: any) => {
          console.error('Something wrong:', error);
        },
      );
    }
  }
}
