import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pet, PetFilters } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private mockPets: Pet[] = [
    {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 2,
      size: 'Large',
      gender: 'Male',
      color: 'Golden',
      description: 'A friendly and energetic dog who loves to play fetch and go for walks.',
      imageUrl: 'assets/German-Shepherd-dog-Alsatian.webp',
      shelterId: '1',
      shelterName: 'Happy Paws Shelter',
      status: 'Available',
      location: 'New York, NY',
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: 'None',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Labrador Mix',
      age: 1,
      size: 'Medium',
      gender: 'Female',
      color: 'Black',
      description: 'A sweet and gentle dog who is great with children and other pets.',
      imageUrl: 'assets/Dog_00154.jfif',
      shelterId: '1',
      shelterName: 'Happy Paws Shelter',
      status: 'Available',
      location: 'New York, NY',
      vaccinated: true,
      spayedNeutered: false,
      specialNeeds: 'Needs regular exercise',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Max',
      breed: 'Beagle',
      age: 3,
      size: 'Medium',
      gender: 'Male',
      color: 'Brown and White',
      description: 'A curious and intelligent dog who loves to explore and sniff around.',
      imageUrl: 'assets/images.jfif',
      shelterId: '2',
      shelterName: 'Second Chance Rescue',
      status: 'Available',
      location: 'Los Angeles, CA',
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: 'None',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '4',
      name: 'Bella',
      breed: 'Poodle Mix',
      age: 4,
      size: 'Small',
      gender: 'Female',
      color: 'White',
      description: 'A gentle and calm dog who is perfect for apartment living.',
      imageUrl: 'assets/cute-puppy-stray-dogs-india-was-great-captured-street-where-born-photo-taken-days-s-155243620.webp',
      shelterId: '2',
      shelterName: 'Second Chance Rescue',
      status: 'Adopted',
      location: 'Los Angeles, CA',
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: 'None',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '5',
      name: 'Rocky',
      breed: 'German Shepherd',
      age: 5,
      size: 'Large',
      gender: 'Male',
      color: 'Black and Tan',
      description: 'A loyal and protective dog who would make a great family guardian.',
      imageUrl: 'assets/Indian_Pariah_Dog_named_Scratchy_standing.jpg',
      shelterId: '3',
      shelterName: 'Paws and Hearts',
      status: 'Available',
      location: 'Chicago, IL',
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: 'Needs experienced owner',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '6',
      name: 'Mia',
      breed: 'Maltese',
      age: 2,
      size: 'Small',
      gender: 'Female',
      color: 'White',
      description: 'A playful and affectionate small dog who loves cuddles.',
      imageUrl: 'assets/puppies-4-1-b571108b709a4da6b32030020c86f2f0.jpg',
      shelterId: '3',
      shelterName: 'Paws and Hearts',
      status: 'Available',
      location: 'Chicago, IL',
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: 'None',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    }
  ];

  getPets(filters?: PetFilters): Observable<Pet[]> {
    return new Observable(observer => {
      setTimeout(() => {
        let filteredPets = [...this.mockPets];

        if (filters) {
          if (filters.breed) {
            filteredPets = filteredPets.filter(pet => 
              pet.breed.toLowerCase().includes(filters.breed!.toLowerCase())
            );
          }

          if (filters.age) {
            const ageRange = filters.age.split('-');
            if (ageRange.length === 2) {
              const minAge = parseInt(ageRange[0]);
              const maxAge = parseInt(ageRange[1]);
              filteredPets = filteredPets.filter(pet => 
                pet.age >= minAge && pet.age <= maxAge
              );
            }
          }

          if (filters.size) {
            filteredPets = filteredPets.filter(pet => pet.size === filters.size);
          }

          if (filters.location) {
            filteredPets = filteredPets.filter(pet => 
              pet.location.toLowerCase().includes(filters.location!.toLowerCase())
            );
          }

          if (filters.gender) {
            filteredPets = filteredPets.filter(pet => pet.gender === filters.gender);
          }

          if (filters.vaccinated !== undefined) {
            filteredPets = filteredPets.filter(pet => pet.vaccinated === filters.vaccinated);
          }

          if (filters.spayedNeutered !== undefined) {
            filteredPets = filteredPets.filter(pet => pet.spayedNeutered === filters.spayedNeutered);
          }

          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredPets = filteredPets.filter(pet => 
              pet.name.toLowerCase().includes(searchTerm) ||
              pet.breed.toLowerCase().includes(searchTerm) ||
              pet.description.toLowerCase().includes(searchTerm)
            );
          }
        }

        observer.next(filteredPets);
        observer.complete();
      }, 500);
    });
  }

  getPetById(id: string): Observable<Pet | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const pet = this.mockPets.find(p => p.id === id);
        observer.next(pet);
        observer.complete();
      }, 300);
    });
  }

  getFeaturedPets(): Observable<Pet[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const featuredPets = this.mockPets
          .filter(pet => pet.status === 'Available')
          .slice(0, 6);
        observer.next(featuredPets);
        observer.complete();
      }, 300);
    });
  }

  addPet(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Observable<Pet> {
    return new Observable(observer => {
      setTimeout(() => {
        const newPet: Pet = {
          ...pet,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockPets.push(newPet);
        observer.next(newPet);
        observer.complete();
      }, 500);
    });
  }

  updatePet(id: string, updates: Partial<Pet>): Observable<Pet> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockPets.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockPets[index] = {
            ...this.mockPets[index],
            ...updates,
            updatedAt: new Date()
          };
          observer.next(this.mockPets[index]);
        } else {
          observer.error('Pet not found');
        }
        observer.complete();
      }, 500);
    });
  }

  deletePet(id: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockPets.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockPets.splice(index, 1);
          observer.next(true);
        } else {
          observer.error('Pet not found');
        }
        observer.complete();
      }, 500);
    });
  }

  getBreeds(): Observable<string[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const breeds = [...new Set(this.mockPets.map(pet => pet.breed))].sort();
        observer.next(breeds);
        observer.complete();
      }, 200);
    });
  }

  getLocations(): Observable<string[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const locations = [...new Set(this.mockPets.map(pet => pet.location))].sort();
        observer.next(locations);
        observer.complete();
      }, 200);
    });
  }
}
