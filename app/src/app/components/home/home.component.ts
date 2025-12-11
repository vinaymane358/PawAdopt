import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  featuredPets: Pet[] = [];
  loading = true;

  // Hero carousel images
  carouselImages = [
    'assets/pets/p1.jpg',
    'assets/pets/p2.jpg', 
    'assets/pets/P3.jpg',
    'assets/pets/P4.jpg',
    'assets/pets/p5.jpg'
  ];
  
  currentImageIndex = 0;
  private carouselInterval: any;

  // Array of available pet images from assets/pets folder (kept for fallback)
  private petImages = [
    'assets/pets/Dog_maltese.jpg',
    'assets/pets/Cat_normal.jfif',
    'assets/pets/Dog_German-Shepherd.webp',
    'assets/pets/Other_Cockatiel.jpg',
    'assets/pets/Other_Hamster2.jfif',
    'assets/pets/dog_poodle.jpg',
    'assets/pets/Cat_Maine-Coon.jpeg',
    'assets/pets/Dog_labrodor.jpg',
    'assets/pets/Other_parrot.jfif',
    'assets/pets/shabu.jpg',
    'assets/pets/Other_rabit2.jpeg',
    'assets/pets/Dog_beagle.jpg',
    'assets/pets/Cat_normal2.jpg',
    'assets/pets/Dog_Indie.jpg',
    'assets/pets/Other_grey-parrot.jpg',
    'assets/pets/Dog_maltese2.jpeg',
    'assets/pets/Cat_parsian.jpg',
    'assets/pets/Dog_indie2.jpg',
    'assets/pets/Other_hamster.jfif',
    'assets/pets/Cat_twins.jpg',
    'assets/pets/Dog_indie3.jpg',
    'assets/pets/Other_rabbit-brown.jfif',
    'assets/pets/Cat_white.jfif',
    'assets/pets/Dog_indie6.webp',
    'assets/pets/Other_parot2.jfif',
    'assets/pets/Dog_indie7.jpg',
    'assets/pets/Other_Hamster3.jpg',
    'assets/pets/Cat_normal3.jfif',
    'assets/pets/Dog_3pair-puppy.jpg',
    'assets/pets/Other_rabit.jpeg',
    'assets/pets/Dog_Indie5.jpg',
    'assets/pets/Indie_Dog.jpg',
  ];

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.loadFeaturedPets();
    this.startCarousel();
    
    // Add scroll animations or other initialization logic
    this.initializeAnimations();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextImage();
    }, 4000); // Change image every 4 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  previousImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.carouselImages.length - 1 
      : this.currentImageIndex - 1;
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    return this.carouselImages[this.currentImageIndex];
  }

  loadFeaturedPets() {
    this.petService.getFeaturedPets().subscribe({
      next: (pets) => {
        this.featuredPets = pets || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured pets:', error);
        this.featuredPets = [];
        this.loading = false;
      }
    });
  }


  onImageError(event: any) {
    console.warn('Image failed to load, using fallback:', event.target.src);
    event.target.src = 'assets/pets/Dog_Indie.jpg';
  }
  
  private initializeAnimations() {
    // Initialize any scroll-triggered animations or other effects
    console.log('Home page animations initialized');
  }
}
