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
  Admin = signal('');

  isAdmin = localStorage.getItem('Admin') === 'true';

  ngOnInit() {
    const storedEmail = localStorage.getItem('Email');
    if (!storedEmail) {
      console.log('No email found in localStorage. Redirecting to login page.');
      this.router.navigate(['/login']);
      return;
    }

    this.perfilService.getByEmail(storedEmail).subscribe(
      (response: any) => {
        this.Nombre.set(response.Nombre || 'Desconocido');
        this.Apellidos.set(response.Apellidos || 'Desconocido');
        this.Telefono.set(response.Telefono || 'Desconocido');
        this.Email.set(response.Email || storedEmail);
        this.Direccion.set(response.Direccion || 'Desconocido');
        this.Birthdate.set(response.Birthdate || 'Desconocido');
        this.Admin.set(localStorage.getItem('Admin') || 'false');
      },
      (error: any) => {
        console.error('Something wrong:', error);
      },
    );
  }

  goEdit(){
    this.router.navigate(['/edit-perfil']);
  }

}
