import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { AdoptionRequestService } from '../../../services/adoption-request.service';
import { AuthService } from '../../../services/auth.service';
import { Pet } from '../../../models/pet.model';
import { AdoptionRequest } from '../../../models/adoption-request.model';

@Component({
  selector: 'app-shelter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shelter-dashboard.component.html',
  styleUrls: ['./shelter-dashboard.component.css']
})
export class ShelterDashboardComponent implements OnInit {
  myPets: Pet[] = [];
  loading = true;
  currentUser: any = null;

  adoptedPets = 0;
  pendingRequests = 0;
  totalRequests = 0;

  constructor(
    private petService: PetService,
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMyPets();
    this.loadStats();
  }

  loadMyPets() {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets) => {
        // Filter pets for current shelter
        this.myPets = pets.filter(pet => pet.shelterId === this.currentUser?.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.loading = false;
      }
    });
  }

  loadStats() {
    // Mock stats - in real app, this would come from API
    this.adoptedPets = this.myPets.filter(pet => pet.status === 'Adopted').length;
    this.pendingRequests = 3; // Mock data
    this.totalRequests = 12; // Mock data
  }

  onImageError(event: any) {
    event.target.src = 'img/default-pet.jpg';
  }
}
