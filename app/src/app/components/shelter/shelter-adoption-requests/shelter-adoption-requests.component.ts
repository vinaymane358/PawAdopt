import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdoptionRequestService } from '../../../services/adoption-request.service';
import { AuthService } from '../../../services/auth.service';
import { AdoptionRequest, UpdateAdoptionRequest } from '../../../models/adoption-request.model';

@Component({
  selector: 'app-shelter-adoption-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shelter-adoption-requests.component.html',
  styleUrls: ['./shelter-adoption-requests.component.css']
})
export class ShelterAdoptionRequestsComponent implements OnInit {
  requests: AdoptionRequest[] = [];
  filteredRequests: AdoptionRequest[] = [];
  loading = true;
  activeTab = 'all';
  showReviewModal = false;
  selectedRequest: AdoptionRequest | null = null;
  reviewAction = '';
  saving = false;
  currentUser: any = null;

  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  totalCount = 0;

  reviewForm: FormGroup;

  constructor(
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      status: ['', [Validators.required]],
      adminComments: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    console.log('🔍 Loading adoption requests for shelter:', this.currentUser);
    if (this.currentUser?.id) {
      this.adoptionRequestService.getRequestsByShelter(this.currentUser.id).subscribe({
        next: (requests) => {
          console.log('✅ Loaded adoption requests for shelter:', requests);
          this.requests = requests;
          this.updateCounts();
          this.filterRequests();
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error loading requests:', error);
          this.loading = false;
        }
      });
    } else {
      console.log('❌ No current user ID found for shelter');
      this.loading = false;
    }
  }

  updateCounts() {
    this.pendingCount = this.requests.filter(r => r.status === 'Pending').length;
    this.approvedCount = this.requests.filter(r => r.status === 'Approved').length;
    this.rejectedCount = this.requests.filter(r => r.status === 'Rejected').length;
    this.totalCount = this.requests.length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.filterRequests();
  }

  filterRequests() {
    if (this.activeTab === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(r => r.status.toLowerCase() === this.activeTab);
    }
  }

  openReviewModal(request: AdoptionRequest, action: string) {
    this.selectedRequest = request;
    this.reviewAction = action;
    this.reviewForm.patchValue({
      status: action === 'Approved' ? 'Approved' : 'Rejected',
      adminComments: request.adminComments || ''
    });
    this.showReviewModal = true;
  }

  closeReviewModal(event?: Event) {
    if (!event || (event.target as Element).classList.contains('modal')) {
      this.showReviewModal = false;
      this.selectedRequest = null;
      this.reviewAction = '';
      this.reviewForm.reset();
    }
  }

  submitReview() {
    if (this.reviewForm.valid && this.selectedRequest) {
      this.saving = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.saving = false;
        return;
      }

      const updateData: UpdateAdoptionRequest = {
        status: this.reviewForm.value.status,
        adminComments: this.reviewForm.value.adminComments
      };

      this.adoptionRequestService.updateRequest(
        this.selectedRequest.id, 
        updateData, 
        currentUser.email
      ).subscribe({
        next: (updatedRequest) => {
          const index = this.requests.findIndex(r => r.id === updatedRequest.id);
          if (index !== -1) {
            this.requests[index] = updatedRequest;
            this.updateCounts();
            this.filterRequests();
          }
          this.saving = false;
          this.closeReviewModal();
          alert(`Request ${updateData.status.toLowerCase()} successfully!`);
        },
        error: (error) => {
          this.saving = false;
          console.error('Error updating request:', error);
          alert('Failed to update request. Please try again.');
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'img/default-pet.jpg';
  }
}
