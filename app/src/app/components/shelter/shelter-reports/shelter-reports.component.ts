import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../../services/pet.service';
import { AdoptionRequestService } from '../../../services/adoption-request.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-shelter-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shelter-reports.component.html',
  styleUrls: ['./shelter-reports.component.css']
})
export class ShelterReportsComponent implements OnInit {
  totalPets = 0;
  adoptedPets = 0;
  pendingRequests = 0;
  adoptionRate = 0;
  currentUser: any = null;

  topBreeds = [
    { name: 'Golden Retriever', count: 8 },
    { name: 'Labrador', count: 6 },
    { name: 'German Shepherd', count: 5 },
    { name: 'Mixed Breed', count: 12 },
    { name: 'Beagle', count: 4 }
  ];

  recentActivity = [
    { icon: 'fas fa-plus', description: 'New pet "Luna" added', time: '2 hours ago' },
    { icon: 'fas fa-heart', description: 'Adoption approved for "Buddy"', time: '4 hours ago' },
    { icon: 'fas fa-clock', description: 'New request for "Max"', time: '6 hours ago' },
    { icon: 'fas fa-times', description: 'Request rejected for "Bella"', time: '1 day ago' },
    { icon: 'fas fa-edit', description: 'Pet "Charlie" updated', time: '2 days ago' }
  ];

  monthlyStats = {
    newPets: 12,
    adoptions: 18,
    requests: 25,
    avgResponseTime: 4.5
  };

  constructor(
    private petService: PetService,
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats() {
    this.petService.getPets().subscribe({
      next: (pets) => {
        const myPets = pets.filter(pet => pet.shelterId === this.currentUser?.id);
        this.totalPets = myPets.length;
        this.adoptedPets = myPets.filter(pet => pet.status === 'Adopted').length;
        this.adoptionRate = this.totalPets > 0 ? Math.round((this.adoptedPets / this.totalPets) * 100) : 0;
      },
      error: (error) => {
        console.error('Error loading pet stats:', error);
      }
    });

    this.adoptionRequestService.getAllRequests().subscribe({
      next: (requests) => {
        const myRequests = requests.filter(request => request.shelterId === this.currentUser?.id);
        this.pendingRequests = myRequests.filter(r => r.status === 'Pending').length;
      },
      error: (error) => {
        console.error('Error loading request stats:', error);
      }
    });
  }
}
