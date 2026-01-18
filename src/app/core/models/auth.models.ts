export interface AuthRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    GESTIONNAIRE_APPROVISIONNEMENT = 'GESTIONNAIRE_APPROVISIONNEMENT',
    RESPONSABLE_ACHATS = 'RESPONSABLE_ACHATS',
    SUPERVISEUR_LOGISTIQUE = 'SUPERVISEUR_LOGISTIQUE',
    CHEF_PRODUCTION = 'CHEF_PRODUCTION',
    PLANIFICATEUR = 'PLANIFICATEUR',
    SUPERVISEUR_PRODUCTION = 'SUPERVISEUR_PRODUCTION',
    GESTIONNAIRE_COMMERCIAL = 'GESTIONNAIRE_COMMERCIAL',
    RESPONSABLE_LOGISTIQUE = 'RESPONSABLE_LOGISTIQUE',
    SUPERVISEUR_LIVRAISONS = 'SUPERVISEUR_LIVRAISONS'
}

export interface User {
    sub: string; // email
    roles: Role[];
    exp: number;
}
