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
        if (this.loginForm.invalid) {
            return;
        }
        console.log(this.loginForm.value);

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Login error', err);
                if (err.status === 401) {
                    this.errorMessage = 'Email ou mot de passe incorrect.';
                } else {
                    this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
                }
            }
        });
    }
}
