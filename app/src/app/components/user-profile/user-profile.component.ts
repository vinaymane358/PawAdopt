import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
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

  constructor(
    private authService: AuthService,
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
    // Mock data - in real app, this would come from a service
    this.totalRequests = 5;
    this.pendingRequests = 2;
    this.approvedRequests = 2;
    this.rejectedRequests = 1;
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
  }
}
