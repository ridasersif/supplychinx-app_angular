import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        console.log('LoginComponent: onSubmit called');
        console.log('LoginComponent: Form valid:', this.loginForm.valid);

        if (this.loginForm.invalid) {
            console.warn('LoginComponent: Form is invalid', this.loginForm.errors);
            // Mark all as touched to show validation errors
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;
        console.log('LoginComponent: Starting login request for:', email);

        this.authService.login({ email, password }).subscribe({
            next: (response) => {
                console.log('LoginComponent: Login successful, navigating to dashboard...');
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error('LoginComponent: Login error:', err);
                this.isLoading = false;

                if (err.name === 'TimeoutError') {
                    this.errorMessage = 'Le serveur ne répond pas (Timeout). Vérifiez si le backend est lancé.';
                } else if (err.status === 401) {
                    this.errorMessage = 'Email ou mot de passe incorrect.';
                } else if (err.status === 0) {
                    this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou si le backend est actif.';
                } else {
                    this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
                }
            }
        });
    }
}
