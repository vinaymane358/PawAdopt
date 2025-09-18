import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AdoptionRequestService } from '../../services/adoption-request.service';
import { AuthService } from '../../services/auth.service';
import { Pet } from '../../models/pet.model';
import { CreateAdoptionRequest } from '../../models/adoption-request.model';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  pet: Pet | null | undefined = null;
  loading = true;
  isAuthenticated = false;
  showAdoptionModal = false;
  adoptionMessage = '';
  submittingAdoption = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadPet();
  }

  loadPet() {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.petService.getPetById(petId).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading pet:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/pets']);
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  openAdoptionModal() {
    this.showAdoptionModal = true;
    this.adoptionMessage = '';
  }

  closeAdoptionModal(event?: Event) {
    if (!event || (event.target as Element).classList.contains('modal')) {
      this.showAdoptionModal = false;
      this.adoptionMessage = '';
    }
  }

  submitAdoptionRequest() {
    if (!this.pet || !this.adoptionMessage.trim()) return;

    this.submittingAdoption = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.submittingAdoption = false;
      return;
    }

    const request: CreateAdoptionRequest = {
      petId: this.pet.id,
      message: this.adoptionMessage.trim()
    };

    this.adoptionRequestService.createRequest(
      request,
      currentUser.id,
      `${currentUser.firstName} ${currentUser.lastName}`,
      currentUser.email,
      currentUser.phone,
      this.pet.shelterId
    ).subscribe({
      next: (response) => {
        this.submittingAdoption = false;
        this.showAdoptionModal = false;
        this.adoptionMessage = '';
        alert('Adoption request submitted successfully! We\'ll contact you soon.');
      },
      error: (error) => {
        this.submittingAdoption = false;
        console.error('Error submitting adoption request:', error);
        alert('Failed to submit adoption request. Please try again.');
      }
    });
  }

  sharePet() {
    if (navigator.share) {
      navigator.share({
        title: `Adopt ${this.pet?.name} - PawAdopt`,
        text: `Check out ${this.pet?.name}, a ${this.pet?.breed} looking for a loving home!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Pet link copied to clipboard!');
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/Indie_Dog.jpg';
  }
}
