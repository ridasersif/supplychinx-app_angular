import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/auth.models';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // Check for roles
        const expectedRoles = route.data['roles'] as Role[];
        if (expectedRoles) {
            const hasRole = expectedRoles.some(role => authService.hasRole(role));
            if (!hasRole) {
                // Unauthorized access to role-protected route
                // Redirect to dashboard or a 403 page
                console.warn('Access denied: Insufficient Role');
                return false;
            }
        }
        return true;
    }

    // Not authenticated
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
