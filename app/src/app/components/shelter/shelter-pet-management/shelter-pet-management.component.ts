import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PetService } from '../../../services/pet.service';
import { AuthService } from '../../../services/auth.service';
import { Pet } from '../../../models/pet.model';

@Component({
  selector: 'app-shelter-pet-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shelter-pet-management.component.html',
  styleUrls: ['./shelter-pet-management.component.css']
})
export class ShelterPetManagementComponent implements OnInit {
  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  loading = true;
  showPetModal = false;
  editingPet: Pet | null = null;
  saving = false;
  currentUser: any = null;
  imagePreviewDataUrl: string | null = null;

  filterForm: FormGroup;
  petForm: FormGroup;

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: ['']
    });

    this.petForm = this.fb.group({
      name: ['', [Validators.required]],
      breed: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0)]],
      petType: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      color: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      location: ['', [Validators.required]],
      status: ['Available', [Validators.required]],
      vaccinated: [false]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPets();
  }

  loadPets() {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets) => {
        // Filter pets for current shelter
        this.pets = pets.filter(pet => pet.shelterId === this.currentUser?.id);
        this.filteredPets = this.pets;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    this.filteredPets = this.pets.filter(pet => {
      const matchesSearch = !filters.search || 
        pet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || pet.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredPets = [...this.pets];
  }

  openAddPetModal() {
    this.editingPet = null;
    this.petForm.reset();
    this.petForm.patchValue({
      status: 'Available',
      petType: '',
      vaccinated: false,
      spayedNeutered: false,
      specialNeeds: 'None'
    });
    this.imagePreviewDataUrl = null;
    this.showPetModal = true;
  }

  editPet(pet: Pet) {
    this.editingPet = pet;
    this.petForm.patchValue({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      petType: pet.petType,
      gender: pet.gender,
      color: pet.color,
      description: pet.description,
      imageUrl: pet.imageUrl,
      location: pet.location,
      status: pet.status,
      vaccinated: pet.vaccinated
    });
    this.imagePreviewDataUrl = pet.imageUrl?.startsWith('data:') ? pet.imageUrl : null;
    this.showPetModal = true;
  }

  closePetModal(event?: Event) {
    if (!event || (event.target as Element).classList.contains('modal')) {
      this.showPetModal = false;
      this.editingPet = null;
      this.petForm.reset();
    }
  }

  savePet() {
    if (this.petForm.valid) {
      this.saving = true;
      const formValue = this.petForm.value;

      if (this.editingPet) {
        // Update existing pet
        this.petService.updatePet(this.editingPet.id, formValue).subscribe({
          next: (updatedPet) => {
            const index = this.pets.findIndex(p => p.id === updatedPet.id);
            if (index !== -1) {
              this.pets[index] = updatedPet;
              this.filteredPets = [...this.pets];
            }
            this.saving = false;
            this.closePetModal();
            alert('Pet updated successfully!');
          },
          error: (error) => {
            this.saving = false;
            console.error('Error updating pet:', error);
            alert('Failed to update pet. Please try again.');
          }
        });
      } else {
        // Add new pet
        // Resolve shelter id from backend by email to ensure relational link
        const currentEmail = this.currentUser.email;
        this.petService.getShelterByEmail(currentEmail).subscribe({
          next: (newPet) => {
            const shelter = newPet; // endpoint returns shelter
            const newPetData = {
              ...formValue,
              shelterId: (shelter && shelter.id) ? shelter.id.toString() : this.currentUser.id,
              shelterName: (shelter && shelter.shelterName) ? shelter.shelterName : (
                (this.currentUser.shelterName && this.currentUser.shelterName.trim())
                || `${(this.currentUser.firstName || '').trim()} ${(this.currentUser.lastName || '').trim()}`.trim()
                || 'Unknown Shelter')
            };

            this.petService.addPet(newPetData).subscribe({
              next: (createdPet) => {
                this.pets.push(createdPet);
                this.filteredPets = [...this.pets];
                this.saving = false;
                this.closePetModal();
                alert('Pet added successfully!');
              },
              error: (error) => {
                this.saving = false;
                console.error('Error adding pet:', error);
                alert('Failed to add pet. Please try again.');
              }
            });
          },
          error: (error) => {
            // If lookup fails, fallback to using current user id
            const fallbackPetData = {
              ...formValue,
              shelterId: this.currentUser.id,
              shelterName: (this.currentUser.shelterName && this.currentUser.shelterName.trim())
                || `${(this.currentUser.firstName || '').trim()} ${(this.currentUser.lastName || '').trim()}`.trim()
                || 'Unknown Shelter'
            };
            this.petService.addPet(fallbackPetData).subscribe({
              next: (createdPet) => {
                this.pets.push(createdPet);
                this.filteredPets = [...this.pets];
                this.saving = false;
                this.closePetModal();
                alert('Pet added successfully!');
              },
              error: (err2) => {
                this.saving = false;
                console.error('Error adding pet after fallback:', err2);
                alert('Failed to add pet. Please try again.');
              }
            });
          }
        });
      }
    }
  }

  deletePet(pet: Pet) {
    if (confirm(`Are you sure you want to delete ${pet.name}? This action cannot be undone.`)) {
      this.petService.deletePet(pet.id).subscribe({
        next: (success) => {
          if (success) {
            this.pets = this.pets.filter(p => p.id !== pet.id);
            this.filteredPets = [...this.pets];
            alert('Pet deleted successfully!');
          }
        },
        error: (error) => {
          console.error('Error deleting pet:', error);
          alert('Failed to delete pet. Please try again.');
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'img/default-pet.jpg';
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.imagePreviewDataUrl = dataUrl;
      this.petForm.get('imageUrl')?.setValue(dataUrl);
      this.petForm.get('imageUrl')?.markAsDirty();
      this.petForm.get('imageUrl')?.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }
}
