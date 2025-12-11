import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();


  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  private extractShelterName(rawUser: any, role: string, firstName?: string, lastName?: string): string | undefined {
    if (role !== 'Shelter') return undefined;
    const candidates: Array<string | undefined> = [
      rawUser?.shelterName,
      rawUser?.sheltername,
      rawUser?.shelter_name,
      rawUser?.name,
      rawUser?.organizationName,
      rawUser?.orgName,
      rawUser?.shelter?.shelterName,
      rawUser?.shelter?.name,
      rawUser?.shelter?.displayName,
      rawUser?.organization?.name
    ];
    const picked = candidates.find(v => typeof v === 'string' && v.trim().length > 0)?.trim();
    if (picked) return picked;
    const combined = `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim();
    return combined || undefined;
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/auth/login`, loginRequest).subscribe({
        next: (response) => {
          // Convert backend response to frontend format
          const user: User = {
            id: response.user.id.toString(),
            email: response.user.email,
            password: '', // Don't store password
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            shelterName: this.extractShelterName(response.user, response.user.role, response.user.firstName, response.user.lastName),
            phone: response.user.phone,
            address: response.user.address,
            city: response.user.city,
            state: response.user.state,
            zipCode: response.user.zipCode,
            role: response.user.role,
            isActive: response.user.isActive,
            createdAt: new Date(response.user.createdAt),
            updatedAt: new Date(response.user.updatedAt)
          };

          if (user.role === 'Shelter') {
            user.shelterName = (user.shelterName && user.shelterName.trim()) || 'Unknown Shelter';
          }

          const authResponse: AuthResponse = {
            user: user,
            token: response.token
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
          
          observer.next(authResponse);
          observer.complete();
        },
        error: (error) => {
          observer.error(error.error || 'Login failed');
        }
      });
    });
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/auth/register`, registerRequest).subscribe({
        next: (response) => {
          // Convert backend response to frontend format
          const user: User = {
            id: response.user.id.toString(),
            email: response.user.email,
            password: '', // Don't store password
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            shelterName: this.extractShelterName(response.user, response.user.role, response.user.firstName, response.user.lastName),
            phone: response.user.phone,
            address: response.user.address,
            city: response.user.city,
            state: response.user.state,
            zipCode: response.user.zipCode,
            role: response.user.role,
            isActive: response.user.isActive,
            createdAt: new Date(response.user.createdAt),
            updatedAt: new Date(response.user.updatedAt)
          };

          if (user.role === 'Shelter') {
            user.shelterName = (user.shelterName && user.shelterName.trim()) || 'Unknown Shelter';
          }

          const authResponse: AuthResponse = {
            user: user,
            token: response.token
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);

          observer.next(authResponse);
          observer.complete();
        },
        error: (error) => {
          observer.error(error.error || 'Registration failed');
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'Admin' || user.role === 'SuperAdmin' : false;
  }

  isShelter(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'Shelter' : false;
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'SuperAdmin' : false;
  }
}
