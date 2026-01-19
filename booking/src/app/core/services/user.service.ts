// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { UserProfileResponseDTO, UpdateProfileRequestDTO, UpdatePasswordRequestDTO } from '../../shared/models/user-service.model';


@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly baseUrl = ApiConfig.userService;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserProfileResponseDTO> {
        return this.http.get<UserProfileResponseDTO>(`${this.baseUrl}/auth/profile`);
    }

    updateProfile(request: UpdateProfileRequestDTO): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/auth/profile`, request);
    }

    updatePassword(request: UpdatePasswordRequestDTO): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/auth/password`, request);
    }

    deleteAccount(): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/auth`);
    }
}
