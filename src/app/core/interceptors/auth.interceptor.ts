import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    let authReq = req;
    if (token) {
        authReq = addTokenHeader(req, token);
    }

    return next(authReq).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(authReq, next, authService);
            }
            return throwError(() => error);
        })
    );
};

function addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((token: any) => {
                isRefreshing = false;
                // token might be full object or we fetch from service
                const newToken = authService.getAccessToken();
                refreshTokenSubject.next(newToken);
                return next(addTokenHeader(request, newToken!));
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
                return next(addTokenHeader(request, jwt));
            })
        );
    }
}
