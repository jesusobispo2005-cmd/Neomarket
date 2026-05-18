import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../components/login/login.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const adminInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const publicRoutes = [
    '/api/users/login',
    '/api/users/register',
  ];

  // Comprueba que es publica
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // Si no es publica
  let clonedReq = req;
  if (!isPublicRoute) {
    const token = loginService.getToken();
    if (token) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  // Errores
  return next(clonedReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        console.error('No autorizado - Token inválido o expirado');
        loginService.logout();
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        console.error('Acceso denegado - Se requieren permisos de administrador');
        router.navigate(['/']);
      }

      console.error('Error HTTP interceptado:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url
      });

      return throwError(() => error);
    })
  );
};
