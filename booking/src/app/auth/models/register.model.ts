export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    role: UserRole;
}

export enum UserRole {
    Host = 0,
    Guest = 1
}
