import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();


  constructor() {
    // Load user from localStorage on service initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Mock implementation - in real app, this would call an API
    return new Observable(observer => {
      setTimeout(() => {
        // Mock users for testing
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe',
            phone: '123-456-7890',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            role: 'User',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
           {
             id: '2',
             email: 'shelter@example.com',
             password: 'shelter123',
             firstName: 'Happy Paws',
             lastName: 'Shelter',
             phone: '555-123-4567',
             address: '456 Pet Street',
             city: 'New York',
             state: 'NY',
             zipCode: '10001',
             role: 'Shelter',
             isActive: true,
             createdAt: new Date(),
             updatedAt: new Date()
           },
           {
             id: '3',
             email: 'admin@example.com',
             password: 'admin123',
             firstName: 'Admin',
             lastName: 'User',
             phone: '123-456-7890',
             address: '456 Admin St',
             city: 'New York',
             state: 'NY',
             zipCode: '10001',
             role: 'Admin',
             isActive: true,
             createdAt: new Date(),
             updatedAt: new Date()
           }
        ];

        const user = mockUsers.find(u => 
          u.email === loginRequest.email && 
          u.password === loginRequest.password && 
          u.role === loginRequest.role
        );
        
        if (user) {
          const response: AuthResponse = {
            user: { ...user, password: '' }, // Don't return password
            token: 'mock-jwt-token-' + user.id
          };
          
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          
          observer.next(response);
          observer.complete();
        } else {
          observer.error('Invalid credentials');
        }
      }, 1000);
    });
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    // Mock implementation
    return new Observable(observer => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          email: registerRequest.email,
          password: registerRequest.password,
          firstName: registerRequest.firstName,
          lastName: registerRequest.lastName,
          phone: registerRequest.phone,
          address: registerRequest.address,
          city: registerRequest.city,
          state: registerRequest.state,
          zipCode: registerRequest.zipCode,
          role: registerRequest.role as 'User' | 'Shelter' | 'Admin' | 'SuperAdmin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const response: AuthResponse = {
          user: { ...newUser, password: '' },
          token: 'mock-jwt-token-' + newUser.id
        };

        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);

        observer.next(response);
        observer.complete();
      }, 1000);
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
