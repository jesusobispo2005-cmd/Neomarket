import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../components/login/login.service';

export const adminInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Clonamos la petición original para añadir el token de autorización
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer mi_token_secreto'
    }
  });

  // 2. Pasamos la petición clonada al siguiente manejador
  return next(clonedReq);
};
