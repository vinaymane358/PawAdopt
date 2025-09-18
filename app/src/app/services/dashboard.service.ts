import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats, AdoptionTrend, BreedPopularity, ShelterActivity } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getDashboardStats(): Observable<DashboardStats> {
    return new Observable(observer => {
      setTimeout(() => {
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
      }, 300);
    });
  }

  getAdoptionTrends(): Observable<AdoptionTrend[]> {
    return new Observable(observer => {
      setTimeout(() => {
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
      }, 300);
    });
  }

  getBreedPopularity(): Observable<BreedPopularity[]> {
    return new Observable(observer => {
      setTimeout(() => {
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
      }, 300);
    });
  }

  getShelterActivity(): Observable<ShelterActivity[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const activity: ShelterActivity[] = [
          { shelterName: 'Happy Paws Shelter', totalPets: 10, adoptions: 4, pendingRequests: 2 },
          { shelterName: 'Second Chance Rescue', totalPets: 8, adoptions: 2, pendingRequests: 1 },
          { shelterName: 'Paws and Hearts', totalPets: 7, adoptions: 1, pendingRequests: 2 }
        ];
        observer.next(activity);
        observer.complete();
      }, 300);
    });
  }
}
