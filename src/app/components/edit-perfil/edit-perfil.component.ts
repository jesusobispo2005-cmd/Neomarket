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
  public router = inject(Router);
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
  Admin = signal(false);

  ngOnInit() {
    const email = localStorage.getItem('Email')?.toString() || '';
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.editPerfilService.getByEmail(email).subscribe(
      (response: any) => {
        this.Nombre.set(response.Nombre || '');
        this.Apellidos.set(response.Apellidos || '');
        this.Telefono.set(response.Telefono || '');
        this.Email.set(response.Email || '');
        this.Password.set('');
        this.Direccion.set(response.Direccion || '');
        this.Wishlist.set(response.Wishlist || []);
        this.Cartera.set(response.Cartera || 0);
        this.Birthdate.set(response.Birthdate || '');
        this.Admin.set(response.Admin === true);
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
      Direccion: this.Direccion(),
      Admin: this.Admin(),
      Wishlist: this.Wishlist(),
      Cartera: this.Cartera(),
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
