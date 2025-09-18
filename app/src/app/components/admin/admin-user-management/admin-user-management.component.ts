import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  showUserModal = false;
  selectedUser: User | null = null;

  totalUsers = 0;
  activeUsers = 0;
  adminUsers = 0;
  blockedUsers = 0;

  filterForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      role: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // Mock data - in real app, this would come from a service
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'user@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        role: 'User',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '123-456-7890',
        address: '456 Admin St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        role: 'Admin',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        email: 'jane@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '987-654-3210',
        address: '789 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        role: 'User',
        isActive: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    setTimeout(() => {
      this.users = mockUsers;
      this.updateCounts();
      this.filteredUsers = [...this.users];
      this.loading = false;
    }, 1000);
  }

  updateCounts() {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.isActive).length;
    this.adminUsers = this.users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length;
    this.blockedUsers = this.users.filter(u => !u.isActive).length;
  }

  applyFilters() {
    const filters = this.filterForm.value;
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !filters.search || 
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && user.isActive) ||
        (filters.status === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredUsers = [...this.users];
  }

  viewUser(user: User) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(event?: Event) {
    if (!event || (event.target as Element).classList.contains('modal')) {
      this.showUserModal = false;
      this.selectedUser = null;
    }
  }

  toggleUserStatus(user: User) {
    const action = user.isActive ? 'block' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
      user.isActive = !user.isActive;
      user.updatedAt = new Date();
      this.updateCounts();
      this.filteredUsers = [...this.users];
      alert(`User ${action}ed successfully!`);
    }
  }
}
