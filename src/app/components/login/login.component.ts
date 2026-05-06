import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);

  constructor(private loginService: LoginService) {}
  

  Nombre = signal('');
  Apellidos = signal('');
  Telefono = signal('');
  Email = signal('');
  Password = signal('');
  Direccion = signal('');
  Birthdate = signal('');

  userRegister() {
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
    this.loginService.register(userData).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        // Reset form
        this.Nombre.set('');
        this.Apellidos.set('');
        this.Telefono.set('');
        this.Email.set('');
        this.Password.set('');
        this.Direccion.set('');
        this.Birthdate.set('');
        window.alert('Registration successful! You can now log in with your credentials.');
      },
      (error: any) => {
        console.error('Registration failed:', error);
        window.alert('Registration failed. Please try again.');
      },
    );
  }

  userLogin() {
    const loginData = {
      Email: this.Email(),
      Password: this.Password(),
    };
    this.loginService.login(loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        // Handle successful login, e.g., store token, redirect, etc.
        localStorage.setItem('Token', response.token);
        localStorage.setItem('Email', response.foundUser.Email);
        localStorage.setItem('Admin', response.foundUser.Admin.toString());
        console.log('Token stored in localStorage:', localStorage.getItem('Token'));
        console.log('Email stored in localStorage:', localStorage.getItem('Email'));
        console.log('Admin status stored in localStorage:', localStorage.getItem('Admin'));
        window.alert('Login successful! Welcome back.');
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.error('Login failed:', error);
        window.alert('Login failed. Please check your credentials.');
      },
    );
  }
}
