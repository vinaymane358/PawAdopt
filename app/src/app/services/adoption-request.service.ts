import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdoptionRequest, CreateAdoptionRequest, UpdateAdoptionRequest } from '../models/adoption-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestService {
  private mockRequests: AdoptionRequest[] = [
    {
      id: '1',
      petId: '1',
      petName: 'Buddy',
      petImageUrl: 'img/German-Shepherd-dog-Alsatian.webp',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'user@example.com',
      userPhone: '123-456-7890',
      shelterId: '2',
      status: 'Pending',
      message: 'I would love to adopt Buddy. I have a large backyard and experience with large dogs.',
      requestedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      petId: '2',
      petName: 'Luna',
      petImageUrl: 'img/Dog_00154.jfif',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'user@example.com',
      userPhone: '123-456-7890',
      shelterId: '2',
      status: 'Approved',
      message: 'Luna would be perfect for our family. We have two children who love dogs.',
      adminComments: 'Great family, approved after home visit.',
      requestedAt: new Date('2024-01-18'),
      reviewedAt: new Date('2024-01-19'),
      reviewedBy: 'admin@example.com'
    },
    {
      id: '3',
      petId: '3',
      petName: 'Max',
      petImageUrl: 'img/images.jfif',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      userPhone: '987-654-3210',
      shelterId: '2',
      status: 'Rejected',
      message: 'I live in an apartment and Max needs more space.',
      adminComments: 'Apartment too small for this active breed.',
      requestedAt: new Date('2024-01-15'),
      reviewedAt: new Date('2024-01-16'),
      reviewedBy: 'admin@example.com'
    }
  ];

  getRequestsByUser(userId: string): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const userRequests = this.mockRequests.filter(req => req.userId === userId);
        observer.next(userRequests);
        observer.complete();
      }, 300);
    });
  }

  getAllRequests(): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([...this.mockRequests]);
        observer.complete();
      }, 300);
    });
  }

  getRequestById(id: string): Observable<AdoptionRequest | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const request = this.mockRequests.find(req => req.id === id);
        observer.next(request);
        observer.complete();
      }, 200);
    });
  }

  createRequest(request: CreateAdoptionRequest, userId: string, userName: string, userEmail: string, userPhone: string, shelterId: string): Observable<AdoptionRequest> {
    return new Observable(observer => {
      setTimeout(() => {
        // Get pet details (in real app, this would come from pet service)
        const petDetails = {
          name: 'Pet Name', // Would be fetched from pet service
          imageUrl: 'img/default-pet.jpg'
        };

        const newRequest: AdoptionRequest = {
          id: Date.now().toString(),
          petId: request.petId,
          petName: petDetails.name,
          petImageUrl: petDetails.imageUrl,
          userId,
          userName,
          userEmail,
          userPhone,
          shelterId,
          status: 'Pending',
          message: request.message,
          requestedAt: new Date()
        };

        this.mockRequests.push(newRequest);
        observer.next(newRequest);
        observer.complete();
      }, 500);
    });
  }

  updateRequest(id: string, updates: UpdateAdoptionRequest, reviewedBy: string): Observable<AdoptionRequest> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.mockRequests[index] = {
            ...this.mockRequests[index],
            ...updates,
            reviewedAt: new Date(),
            reviewedBy
          };
          observer.next(this.mockRequests[index]);
        } else {
          observer.error('Request not found');
        }
        observer.complete();
      }, 500);
    });
  }

  getPendingRequests(): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const pendingRequests = this.mockRequests.filter(req => req.status === 'Pending');
        observer.next(pendingRequests);
        observer.complete();
      }, 300);
    });
  }

  getApprovedRequests(): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const approvedRequests = this.mockRequests.filter(req => req.status === 'Approved');
        observer.next(approvedRequests);
        observer.complete();
      }, 300);
    });
  }

  getRejectedRequests(): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const rejectedRequests = this.mockRequests.filter(req => req.status === 'Rejected');
        observer.next(rejectedRequests);
        observer.complete();
      }, 300);
    });
  }
}
