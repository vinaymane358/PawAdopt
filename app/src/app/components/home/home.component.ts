import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredPets: Pet[] = [];
  loading = true;

  // Gallery removed as per request

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.loadFeaturedPets();
  }

  loadFeaturedPets() {
    this.petService.getFeaturedPets().subscribe({
      next: (pets) => {
        this.featuredPets = pets;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured pets:', error);
        this.loading = false;
      }
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/Indie_Dog.jpg';
  }
}
