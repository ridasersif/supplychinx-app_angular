import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, RegisterRequest, AuthResponse, User, Role } from '../models/auth.models';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = environment.apiUrl;

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private tokenService: TokenService
    ) {
        this.loadUserFromToken();
    }

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, authRequest).pipe(
            tap(response => {
                this.tokenService.saveTokens(response.accessToken, response.refreshToken);
                this.loadUserFromToken();
            })
        );
    }

    register(registerRequest: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest).pipe(
            tap(response => {
                this.tokenService.saveTokens(response.accessToken, response.refreshToken);
                this.loadUserFromToken();
            })
        );
    }

    logout(): void {
        const token = this.tokenService.getAccessToken();
        if (token) {
            this.http.post(`${this.API_URL}/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).subscribe({
                next: () => { },
                error: () => { }
            });
        }

        this.tokenService.clearTokens();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
            return of(null);
        }
        return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
            tap(response => {
                const newAccessToken = response.accessToken || response['accessToken'];
                const newRefreshToken = response.refreshToken || response['refreshToken'] || refreshToken;

                if (newAccessToken) {
                    this.tokenService.saveTokens(newAccessToken, newRefreshToken);
                }
            })
        );
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getAccessToken();
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch {
            return false;
        }
    }

    hasRole(role: Role): boolean {
        const user = this.currentUserSubject.value;
        if (!user) return false;
        return user.roles.includes(role);
    }

    private loadUserFromToken(): void {
        const token = this.tokenService.getAccessToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                let roles = decoded.roles || decoded.authorities || decoded.role || [];
                if (!Array.isArray(roles)) {
                    roles = [roles];
                }

                const user: User = {
                    sub: decoded.sub,
                    roles: roles,
                    exp: decoded.exp
                };
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Invalid token', e);
                this.tokenService.clearTokens();
            }
        }
    }
}
