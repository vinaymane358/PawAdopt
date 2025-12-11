import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdoptionRequest, CreateAdoptionRequest, UpdateAdoptionRequest } from '../models/adoption-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestService {
  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

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
      this.http.get<any[]>(`${this.apiUrl}/adoption-requests/user/${userId}`).subscribe({
        next: (requests) => {
          const convertedRequests = requests.map(this.convertBackendRequestToFrontend);
          observer.next(convertedRequests);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching user requests:', error);
          // Fallback to mock data
          const userRequests = this.mockRequests.filter(req => req.userId === userId);
          observer.next(userRequests);
          observer.complete();
        }
      });
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
    const backendPayload = {
      pet: { id: Number(request.petId) },
      user: { id: Number(userId) },
      message: request.message,
      status: 'Pending',
      userName,
      userEmail,
      userPhone,
      shelter: { id: Number(shelterId) }
    };

    console.log('📝 Creating adoption request with payload:', backendPayload);

    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/adoption-requests`, backendPayload).subscribe({
        next: (response) => {
          console.log('✅ Backend response for adoption request:', response);
          const created = response.data || response;
          const converted = this.convertBackendRequestToFrontend(created);
          console.log('✅ Converted adoption request:', converted);
          this.mockRequests.push(converted);
          observer.next(converted);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error creating adoption request via backend, falling back to local:', error);
          // Fallback to local creation
          const newRequest: AdoptionRequest = {
            id: Date.now().toString(),
            petId: request.petId,
            petName: 'Pet Name',
            petImageUrl: 'assets/pets/Indie_Dog.jpg',
            userId,
            userName,
            userEmail,
            userPhone,
            shelterId,
            status: 'Pending',
            message: request.message,
            requestedAt: new Date()
          };
          console.log('📝 Created local fallback request:', newRequest);
          this.mockRequests.push(newRequest);
          observer.next(newRequest);
          observer.complete();
        }
      });
    });
  }

  updateRequest(id: string, updates: UpdateAdoptionRequest, reviewedBy: string): Observable<AdoptionRequest> {
    console.log('📝 Updating adoption request:', { id, updates, reviewedBy });
    
    return new Observable(observer => {
      if (updates.status === 'Approved') {
        this.http.put<any>(`${this.apiUrl}/adoption-requests/${id}/approve`, {
          adminComments: updates.adminComments || ''
        }).subscribe({
          next: (response) => {
            console.log('✅ Request approved:', response);
            const converted = this.convertBackendRequestToFrontend(response);
            const index = this.mockRequests.findIndex(req => req.id === id);
            if (index !== -1) {
              this.mockRequests[index] = converted;
            }
            observer.next(converted);
            observer.complete();
          },
          error: (error) => {
            console.error('❌ Error approving request:', error);
            observer.error(error);
          }
        });
      } else if (updates.status === 'Rejected') {
        this.http.put<any>(`${this.apiUrl}/adoption-requests/${id}/reject`, {
          adminComments: updates.adminComments || ''
        }).subscribe({
          next: (response) => {
            console.log('✅ Request rejected:', response);
            const converted = this.convertBackendRequestToFrontend(response);
            const index = this.mockRequests.findIndex(req => req.id === id);
            if (index !== -1) {
              this.mockRequests[index] = converted;
            }
            observer.next(converted);
            observer.complete();
          },
          error: (error) => {
            console.error('❌ Error rejecting request:', error);
            observer.error(error);
          }
        });
      } else {
        // Fallback to local update for other status changes
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
      }
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

  getRequestsByShelter(shelterId: string): Observable<AdoptionRequest[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/adoption-requests/shelter/${shelterId}`).subscribe({
        next: (requests) => {
          const convertedRequests = requests.map(this.convertBackendRequestToFrontend);
          observer.next(convertedRequests);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching shelter requests:', error);
          // Fallback to mock data
          const shelterRequests = this.mockRequests.filter(req => req.shelterId === shelterId);
          observer.next(shelterRequests);
          observer.complete();
        }
      });
    });
  }

  private convertBackendRequestToFrontend(backendRequest: any): AdoptionRequest {
    // Get the pet image URL from either the populated field or the pet object
    const petImageUrl = backendRequest.petImageUrl || backendRequest.pet?.imageUrl || 'assets/pets/Indie_Dog.jpg';
    
    return {
      id: backendRequest.id.toString(),
      petId: backendRequest.pet?.id?.toString() || '1',
      petName: backendRequest.petName || backendRequest.pet?.name || 'Unknown Pet',
      petImageUrl: petImageUrl,
      userId: backendRequest.user?.id?.toString() || '1',
      userName: backendRequest.userName || 'Unknown User',
      userEmail: backendRequest.userEmail || 'unknown@example.com',
      userPhone: backendRequest.userPhone || 'N/A',
      shelterId: backendRequest.shelter?.id?.toString() || '1',
      status: backendRequest.status || 'Pending',
      message: backendRequest.message || '',
      adminComments: backendRequest.adminComments,
      requestedAt: new Date(backendRequest.requestedAt || Date.now()),
      reviewedAt: backendRequest.reviewedAt ? new Date(backendRequest.reviewedAt) : undefined,
      reviewedBy: backendRequest.reviewedBy
    };
  }
}
