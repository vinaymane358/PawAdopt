import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ShelterDashboardComponent implements OnInit, OnDestroy {
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
    // Load real adoption request stats
    this.adoptedPets = this.myPets.filter(pet => pet.status === 'Adopted').length;
    
    if (this.currentUser?.id) {
      this.adoptionRequestService.getRequestsByShelter(this.currentUser.id).subscribe({
        next: (requests) => {
          this.pendingRequests = requests.filter(req => req.status === 'Pending').length;
          this.totalRequests = requests.length;
        },
        error: (error) => {
          console.error('Error loading adoption request stats:', error);
          // Fallback to mock data
          this.pendingRequests = 0;
          this.totalRequests = 0;
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/pets/Indie_Dog.jpg';
  }
  
  ngOnDestroy() {
    // Clean up any subscriptions or timers if needed
    console.log('Shelter dashboard component destroyed');
  }
}
