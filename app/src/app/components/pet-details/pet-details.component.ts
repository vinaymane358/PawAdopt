import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AdoptionRequestService } from '../../services/adoption-request.service';
import { AuthService } from '../../services/auth.service';
import { FeedbackService, Feedback } from '../../services/feedback.service';
import { Pet } from '../../models/pet.model';
import { CreateAdoptionRequest } from '../../models/adoption-request.model';

interface AdoptionFeedback {
  id: string;
  petId: string;
  name: string;
  rating: number;
  message: string;
  date: Date;
}

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit, OnDestroy {
  pet: Pet | null | undefined = null;
  loading = true;
  isAuthenticated = false;
  showAdoptionModal = false;
  adoptionMessage = '';
  submittingAdoption = false;

  // Feedback properties
  feedbackForm: FormGroup;
  isSubmittingFeedback = false;
  previousFeedback: AdoptionFeedback[] = [];
  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private adoptionRequestService: AdoptionRequestService,
    public authService: AuthService,
    private feedbackService: FeedbackService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.createFeedbackForm();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadPet();
    this.loadPreviousFeedback();
  }

  createFeedbackForm(): FormGroup {
    console.log('Creating feedback form...');
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      rating: [0, [Validators.required, Validators.min(1)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadPet() {
    const petId = this.route.snapshot.paramMap.get('id');
    console.log('🔍 Loading pet with ID:', petId);
    if (petId) {
      this.petService.getPetById(petId).subscribe({
        next: (pet) => {
          console.log('✅ Pet loaded successfully:', pet);
          this.pet = pet;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error loading pet:', error);
          this.loading = false;
        }
      });
    } else {
      console.log('❌ No pet ID provided in route');
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
    
    console.log('🔍 Current user for adoption request:', currentUser);
    console.log('🔍 Pet details for adoption request:', this.pet);
    
    if (!currentUser) {
      console.log('❌ No current user found');
      this.submittingAdoption = false;
      return;
    }

    const request: CreateAdoptionRequest = {
      petId: this.pet.id,
      message: this.adoptionMessage.trim()
    };

    const userName = currentUser.shelterName || `${currentUser.firstName} ${currentUser.lastName}`;

    console.log('📝 Submitting adoption request:', {
      request,
      userId: currentUser.id,
      userName,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      shelterId: this.pet.shelterId
    });

    this.adoptionRequestService.createRequest(
      request,
      currentUser.id,
      userName,
      currentUser.email,
      currentUser.phone,
      this.pet.shelterId
    ).subscribe({
      next: (response) => {
        console.log('✅ Adoption request submitted successfully:', response);
        this.submittingAdoption = false;
        this.showAdoptionModal = false;
        this.adoptionMessage = '';
        alert('Adoption request submitted successfully! We\'ll contact you soon.');
      },
      error: (error) => {
        this.submittingAdoption = false;
        console.error('❌ Error submitting adoption request:', error);
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
    event.target.src = 'assets/pets/Indie_Dog.jpg';
  }

  // Feedback methods
  loadPreviousFeedback() {
    if (this.pet) {
      // Load previous feedback for this pet from backend
      this.feedbackService.getFeedbacksByPet(parseInt(this.pet.id)).subscribe({
        next: (feedbacks) => {
          this.previousFeedback = feedbacks.map(feedback => ({
            id: feedback.id.toString(),
            petId: feedback.petId.toString(),
            name: `User ${feedback.userId}` || 'Anonymous', // Display as User ID for now
            rating: feedback.rating,
            message: feedback.message,
            date: new Date(feedback.createdAt)
          }));
        },
        error: (error) => {
          console.error('Error loading feedback:', error);
          this.previousFeedback = [];
        }
      });
    }
  }

  setRating(rating: number) {
    this.feedbackForm.patchValue({ rating });
    this.feedbackForm.get('rating')?.markAsTouched();
    console.log('Rating set to:', rating, 'Form valid:', this.feedbackForm.valid);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.feedbackForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  submitFeedback() {
    console.log('Form valid:', this.feedbackForm.valid, 'Form value:', this.feedbackForm.value);
    console.log('Pet object:', this.pet);
    
    if (!this.pet) {
      alert('Pet information not loaded. Please refresh the page and try again.');
      return;
    }
    
    if (!this.feedbackForm.valid) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    
    if (this.feedbackForm.valid && this.pet) {
      this.isSubmittingFeedback = true;
      
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user:', currentUser);
      console.log('Is authenticated:', this.authService.isAuthenticated());
      
      if (!currentUser) {
        this.isSubmittingFeedback = false;
        alert('Please log in to submit feedback.');
        return;
      }

      console.log('Pet ID:', this.pet.id, 'Type:', typeof this.pet.id);
      console.log('User ID:', currentUser.id, 'Type:', typeof currentUser.id);
      
      const petId = parseInt(this.pet.id);
      const userId = parseInt(currentUser.id);
      
      console.log('Parsed Pet ID:', petId, 'Parsed User ID:', userId);
      
      if (isNaN(petId) || isNaN(userId)) {
        this.isSubmittingFeedback = false;
        alert('Invalid pet or user ID. Please refresh the page and try again.');
        return;
      }

      const feedback: Feedback = {
        petId: petId,
        userId: userId,
        rating: this.feedbackForm.value.rating,
        message: this.feedbackForm.value.message
      };

      console.log('Submitting feedback:', feedback);
      
      this.feedbackService.createFeedback(feedback).subscribe({
        next: (response) => {
          this.isSubmittingFeedback = false;
          console.log('Feedback submitted successfully:', response);
          this.feedbackForm.reset();
          this.loadPreviousFeedback(); // Reload feedback from backend
          alert('Thank you for sharing your experience!');
        },
        error: (error) => {
          this.isSubmittingFeedback = false;
          console.error('Error submitting feedback:', error);
          console.error('Error details:', error.error);
          console.error('Error status:', error.status);
          alert('Failed to submit feedback: ' + (error.error?.message || error.message || 'Unknown error'));
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.feedbackForm.controls).forEach(key => {
        this.feedbackForm.get(key)?.markAsTouched();
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  ngOnDestroy() {
    // Clean up any subscriptions or timers if needed
    console.log('Pet details component destroyed');
  }
}
