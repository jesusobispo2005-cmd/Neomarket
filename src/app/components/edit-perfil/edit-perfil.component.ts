import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EditPerfilService } from './edit-perfil.service';

@Component({
  selector: 'app-edit-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-perfil.component.html',
  styleUrl: './edit-perfil.component.css',
})
export class EditPerfilComponent {
  private router = inject(Router);
  constructor(private editPerfilService: EditPerfilService) {}

  Nombre = signal('');
  Apellidos = signal('');
  Telefono = signal('');
  Email = signal('');
  Password = signal('');
  Direccion = signal('');
  Wishlist = signal([]);
  Cartera = signal(0);
  Birthdate = signal('');

  ngOnInit() {
    this.editPerfilService.getByEmail(localStorage.getItem('Email')?.toString() || '').subscribe(
      (response: any) => {
        // Reset form
        this.Nombre.set(response.Nombre || '');
        this.Apellidos.set(response.Apellidos || '');
        this.Telefono.set(response.Telefono || '');
        this.Email.set(response.Email || '');
        this.Password.set(response.Password || '');
        this.Direccion.set(response.Direccion || '');
        this.Wishlist.set(response.Wishlist || []);
        this.Cartera.set(response.Cartera || 0);
        this.Birthdate.set(response.Birthdate || '');
        console.log('User data loaded successfully:', response);
      },
      (error: any) => {
        console.error('Something wrong:', error);
      },
    );
  }

  userEdit() {
    const userData = {
      Nombre: this.Nombre(),
      Apellidos: this.Apellidos(),
      Telefono: this.Telefono(),
      Email: this.Email(),
      Password: this.Password(),
      Direccion: this.Direccion(),
      Admin: false,
      Wishlist: [],
      Cartera: 100,
      Birthdate: this.Birthdate(),
    };

    this.editPerfilService.update(localStorage.getItem('Email')?.toString() || '', userData).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        localStorage.setItem('Email', this.Email());
        this.router.navigate(['/perfil']);
      },
      (error: any) => {
        console.error('Error updating user:', error);
      },
    );

  }
}
