import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
  id?: number;
  petId: number;
  userId?: number;
  rating: number;
  message: string;
  createdAt?: Date;
}

export interface FeedbackResponse {
  id: number;
  petId: number;
  userId: number;
  rating: number;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  // Create new feedback
  createFeedback(feedback: Feedback): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.apiUrl}/feedbacks`, feedback);
  }

  // Get feedbacks by pet ID
  getFeedbacksByPet(petId: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/feedbacks/pet/${petId}`);
  }

  // Get feedbacks by user ID
  getFeedbacksByUser(userId: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/feedbacks/user/${userId}`);
  }

  // Get all feedbacks
  getAllFeedbacks(): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/feedbacks`);
  }

  // Get average rating for a pet
  getAverageRatingForPet(petId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/feedbacks/pet/${petId}/average-rating`);
  }
}
