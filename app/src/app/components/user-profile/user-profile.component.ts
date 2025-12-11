import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdoptionRequestService } from '../../services/adoption-request.service';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  profileForm: FormGroup;
  editMode = false;
  loading = false;
  alertMessage = '';
  alertType = '';

  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;
  
  private alertTimeout: any;

  constructor(
    private authService: AuthService,
    private adoptionRequestService: AdoptionRequestService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [''],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserStats();
      this.populateForm();
    }
  }

  populateForm() {
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        address: this.currentUser.address,
        city: this.currentUser.city,
        state: this.currentUser.state,
        zipCode: this.currentUser.zipCode
      });
    }
  }

  loadUserStats() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    console.log('🔍 Loading user stats for:', currentUser);
    
    this.adoptionRequestService.getRequestsByUser(currentUser.id).subscribe({
      next: (requests) => {
        console.log('✅ Loaded user adoption requests:', requests);
        this.totalRequests = requests.length;
        this.pendingRequests = requests.filter(r => r.status === 'Pending').length;
        this.approvedRequests = requests.filter(r => r.status === 'Approved').length;
        this.rejectedRequests = requests.filter(r => r.status === 'Rejected').length;
      },
      error: (error) => {
        console.error('❌ Error loading user stats:', error);
        // Fallback to mock data
        this.totalRequests = 0;
        this.pendingRequests = 0;
        this.approvedRequests = 0;
        this.rejectedRequests = 0;
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.populateForm();
    }
    this.alertMessage = '';
  }

  cancelEdit() {
    this.editMode = false;
    this.alertMessage = '';
    this.populateForm();
  }

  updateProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.loading = true;
      this.alertMessage = '';

      // Mock update - in real app, this would call an API
      setTimeout(() => {
        const formValue = this.profileForm.value;
        this.currentUser = {
          ...this.currentUser!,
          ...formValue,
          updatedAt: new Date()
        };

        // Update in auth service
        this.authService.currentUserSubject.next(this.currentUser);


        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.loading = false;
        this.editMode = false;
        this.showAlert('Profile updated successfully!', 'success');
      }, 1000);
    }
  }

  logout() {
    this.authService.logout();
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    
    // Auto-hide alert after 5 seconds
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    
    this.alertTimeout = setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
  
  ngOnDestroy() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
}
