import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error) => {
            if ([401, 403].includes(error.status)) {
                // auto logout if 401 or 403 response returned from api
                authService.logout();
            }

            // Pass the original error through so components can access status, error body, etc.
            return throwError(() => error);
        })
    );
};
