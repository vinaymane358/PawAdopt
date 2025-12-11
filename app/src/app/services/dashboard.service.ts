import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DashboardStats, AdoptionTrend, BreedPopularity, ShelterActivity } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return new Observable(observer => {
      this.http.get<any>(`${this.apiUrl}/dashboard/stats`).subscribe({
        next: (response) => {
          const stats: DashboardStats = {
            totalPets: response.totalPets || 0,
            availablePets: response.availablePets || 0,
            adoptedPets: response.adoptedPets || 0,
            pendingRequests: response.pendingRequests || 0,
            approvedRequests: response.approvedRequests || 0,
            totalUsers: response.totalUsers || 0,
            activeUsers: response.activeUsers || 0
          };
          observer.next(stats);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching dashboard stats:', error);
          // Fallback to mock data
          const stats: DashboardStats = {
            totalPets: 25,
            availablePets: 18,
            adoptedPets: 7,
            pendingRequests: 5,
            approvedRequests: 12,
            totalUsers: 45,
            activeUsers: 38
          };
          observer.next(stats);
          observer.complete();
        }
      });
    });
  }

  getAdoptionTrends(): Observable<AdoptionTrend[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/dashboard/adoption-trends`).subscribe({
        next: (response) => {
          const trends: AdoptionTrend[] = response.map(item => ({
            month: item.month,
            adoptions: item.adoptions
          }));
          observer.next(trends);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching adoption trends:', error);
          // Fallback to mock data
          const trends: AdoptionTrend[] = [
            { month: 'Jan', adoptions: 3 },
            { month: 'Feb', adoptions: 5 },
            { month: 'Mar', adoptions: 4 },
            { month: 'Apr', adoptions: 7 },
            { month: 'May', adoptions: 6 },
            { month: 'Jun', adoptions: 8 }
          ];
          observer.next(trends);
          observer.complete();
        }
      });
    });
  }

  getBreedPopularity(): Observable<BreedPopularity[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/dashboard/breed-popularity`).subscribe({
        next: (response) => {
          const popularity: BreedPopularity[] = response.map(item => ({
            breed: item.breed,
            count: item.count,
            percentage: item.percentage
          }));
          observer.next(popularity);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching breed popularity:', error);
          // Fallback to mock data
          const popularity: BreedPopularity[] = [
            { breed: 'Golden Retriever', count: 8, percentage: 32 },
            { breed: 'Labrador Mix', count: 6, percentage: 24 },
            { breed: 'German Shepherd', count: 4, percentage: 16 },
            { breed: 'Beagle', count: 3, percentage: 12 },
            { breed: 'Poodle Mix', count: 2, percentage: 8 },
            { breed: 'Maltese', count: 2, percentage: 8 }
          ];
          observer.next(popularity);
          observer.complete();
        }
      });
    });
  }

  getShelterActivity(): Observable<ShelterActivity[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/dashboard/shelter-activity`).subscribe({
        next: (response) => {
          const activity: ShelterActivity[] = response.map(item => ({
            shelterName: item.shelterName,
            totalPets: item.totalPets,
            adoptions: item.adoptions,
            pendingRequests: item.pendingRequests
          }));
          observer.next(activity);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching shelter activity:', error);
          // Fallback to mock data
          const activity: ShelterActivity[] = [
            { shelterName: 'Happy Paws Shelter', totalPets: 10, adoptions: 4, pendingRequests: 2 },
            { shelterName: 'Second Chance Rescue', totalPets: 8, adoptions: 2, pendingRequests: 1 },
            { shelterName: 'Paws and Hearts', totalPets: 7, adoptions: 1, pendingRequests: 2 }
          ];
          observer.next(activity);
          observer.complete();
        }
      });
    });
  }
}
