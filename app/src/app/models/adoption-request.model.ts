export interface AdoptionRequest {
  id: string;
  petId: string;
  petName: string;
  petImageUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  shelterId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  message: string;
  adminComments?: string;
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface CreateAdoptionRequest {
  petId: string;
  message: string;
}

export interface UpdateAdoptionRequest {
  status: 'Approved' | 'Rejected';
  adminComments?: string;
}
