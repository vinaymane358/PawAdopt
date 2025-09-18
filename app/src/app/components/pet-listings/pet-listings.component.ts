import { Component, OnInit } from '@angular/core';
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
export class PetListingsComponent implements OnInit {
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
      age: [''],
      size: [''],
      location: ['']
    });
  }

  ngOnInit() {
    this.loadPets();
    this.loadBreeds();
    this.loadLocations();
  }

  loadPets() {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = pets;
        this.loading = false;
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
        this.filteredPets = pets;
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
    event.target.src = 'assets/Indie_Dog.jpg';
  }
}
