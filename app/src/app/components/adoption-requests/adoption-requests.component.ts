import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdoptionRequestService } from '../../services/adoption-request.service';
import { AuthService } from '../../services/auth.service';
import { AdoptionRequest } from '../../models/adoption-request.model';

@Component({
  selector: 'app-adoption-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adoption-requests.component.html',
  styleUrls: ['./adoption-requests.component.css']
})
export class AdoptionRequestsComponent implements OnInit {
  requests: AdoptionRequest[] = [];
  filteredRequests: AdoptionRequest[] = [];
  loading = true;
  activeTab = 'all';

  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  totalCount = 0;

  constructor(
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.loading = true;
    this.adoptionRequestService.getRequestsByUser(currentUser.id).subscribe({
      next: (requests) => {
        this.requests = requests;
        this.updateCounts();
        this.filterRequests();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading = false;
      }
    });
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

  onImageError(event: any) {
    event.target.src = 'img/default-pet.jpg';
  }
}
