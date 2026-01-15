import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, RegisterRequest, AuthResponse, User, Role } from './auth.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8080/auth';
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromToken();
    }

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, authRequest).pipe(
            tap(response => {
                this.saveTokens(response.accessToken, response.refreshToken);
                this.loadUserFromToken();
            })
        );
    }

    register(registerRequest: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest).pipe(
            tap(response => {
                this.saveTokens(response.accessToken, response.refreshToken);
                this.loadUserFromToken();
            })
        );
    }

    logout(): void {
        const token = this.getAccessToken();
        if (token) {
            this.http.post(`${this.API_URL}/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).subscribe({
                next: () => { },
                error: () => { }
            });
        }

        this.clearTokens();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return of(null as any);
        }
        // Backend expects { "refreshToken": "..." }
        return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
            tap(response => {
                // Adapt response structure if needed. 
                // Backend AuthController returns Map<String, String> or similar.
                // If response is { accessToken: "...", refreshToken: "..." }
                const newAccessToken = response.accessToken || response['accessToken'];
                const newRefreshToken = response.refreshToken || response['refreshToken'] || refreshToken;

                if (newAccessToken) {
                    this.saveTokens(newAccessToken, newRefreshToken);
                }
            })
        );
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        // Simple check. For better UX, check expiry.
        const token = this.getAccessToken();
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
        // Depending on backend, roles might be string or array
        return user.roles.includes(role);
    }

    private saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    private clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    private loadUserFromToken(): void {
        const token = this.getAccessToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Map JWT claims to User object
                // Adjust 'roles' mapping based on actual JWT payload from backend
                // Standard Spring Security might put roles in 'roles' or 'authorities'
                const user: User = {
                    sub: decoded.sub,
                    roles: decoded.roles || decoded.authorities || [],
                    exp: decoded.exp
                };
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Invalid token', e);
                this.clearTokens();
            }
        }
    }
}
