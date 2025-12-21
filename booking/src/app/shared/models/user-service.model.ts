import { UserRole } from "./register.model";

export interface UpdatePasswordRequestDTO {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileRequestDTO {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
}

export interface UserProfileResponseDTO {
    username?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    address?: string | null;
    role?: UserRole | null;
}