import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet, PetFilters } from '../../models/pet.model';

@Component({
  selector: 'app-pet-listings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pet-listings.component.html',
  styleUrls: ['./pet-listings.component.css']
})
export class PetListingsComponent implements OnInit, OnDestroy {
  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  breeds: string[] = [];
  locations: string[] = [];
  loading = true;
  viewMode: 'grid' | 'list' = 'grid';

  filterForm: FormGroup;

  constructor(
    private petService: PetService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      breed: [''],
      petType: [''],
      age: [''],
      location: ['']
    });
  }

  ngOnInit() {
    this.loadPets();
    this.loadBreeds();
    this.loadLocations();
    
    // Debug: Test if we can access the assets folder
    this.testImageAccess();
  }

  testImageAccess() {
    // Test if we can access a known image
    const testImg = new Image();
    testImg.onload = () => console.log('✅ Assets folder is accessible');
    testImg.onerror = () => console.error('❌ Assets folder is not accessible');
    testImg.src = 'assets/pets/Indie_Dog.jpg';
  }

  loadPets() {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets) => {
        // Initialize imageLoaded property for all pets
        this.pets = pets.map(pet => ({ ...pet, imageLoaded: false }));
        this.filteredPets = [...this.pets];
        this.loading = false;
        
        // Debug: Log total count and first few pet image URLs
        console.log(`✅ Total pets loaded: ${pets.length}`);
        console.log('Pet image URLs:');
        pets.slice(0, 5).forEach(pet => {
          console.log(`${pet.name}: ${pet.imageUrl}`);
        });
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.loading = false;
      }
    });
  }

  loadBreeds() {
    this.petService.getBreeds().subscribe({
      next: (breeds) => {
        this.breeds = breeds;
      },
      error: (error) => {
        console.error('Error loading breeds:', error);
      }
    });
  }

  loadLocations() {
    this.petService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  applyFilters() {
    const filters: PetFilters = this.filterForm.value;
    
    // Remove empty values
    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof PetFilters]) {
        delete filters[key as keyof PetFilters];
      }
    });

    this.loading = true;
    this.petService.getPets(filters).subscribe({
      next: (pets) => {
        // Maintain imageLoaded property when filtering
        this.filteredPets = pets.map(pet => {
          const existingPet = this.pets.find(p => p.id === pet.id);
          return { ...pet, imageLoaded: existingPet?.imageLoaded || false };
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering pets:', error);
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredPets = [...this.pets];
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  onImageError(event: any) {
    console.warn('Image failed to load:', event.target.src);
    console.warn('Attempting to load fallback image...');
    // Set a fallback image
    event.target.src = 'assets/pets/Indie_Dog.jpg';
    // Add error class for styling
    event.target.classList.add('image-error');
  }

  onImageLoad(event: any) {
    console.log('Image loaded successfully:', event.target.src);
    // Remove any error classes when image loads successfully
    event.target.classList.remove('image-error');
    // Find the pet and mark image as loaded
    const petId = event.target.getAttribute('data-pet-id');
    if (petId) {
      const pet = this.filteredPets.find(p => p.id === petId);
      if (pet) {
        pet.imageLoaded = true;
        console.log('Marked image as loaded for pet:', pet.name);
      }
    }
  }
  
  ngOnDestroy() {
    // Clean up any subscriptions or timers if needed
    console.log('Pet listings component destroyed');
  }
}
