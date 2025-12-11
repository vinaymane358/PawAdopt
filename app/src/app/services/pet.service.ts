import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pet, PetFilters } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:9090/api';

  // Pets added during this session (not yet persisted by backend)
  private addedPets: Pet[] = this.loadAddedPetsFromStorage();

  constructor(private http: HttpClient) {}

  getPets(filters?: PetFilters): Observable<Pet[]> {
    console.log('🔍 PetService.getPets() called with filters:', filters);
    
    if (filters) {
      // Use backend filter endpoint
      const params = new URLSearchParams();
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.petType) params.append('petType', filters.petType);
      if (filters.location) params.append('location', filters.location);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.vaccinated !== undefined) params.append('vaccinated', filters.vaccinated.toString());
      if (filters.search) params.append('search', filters.search);

      return new Observable(observer => {
        this.http.get<any>(`${this.apiUrl}/pets/filter?${params.toString()}`).subscribe({
          next: (response) => {
            console.log('✅ Backend filter response:', response);
            const pets = Array.isArray(response) ? response : response.data || [];
            const convertedPets = pets.map(this.convertBackendPetToFrontend);
            // Merge in locally added pets that match filters and are not duplicates
            const localMatches = this.addedPets.filter(p => this.petMatchesFilters(p, filters!));
            const merged = this.mergeUniquePets(convertedPets, localMatches);
            console.log(`📊 Filtered pets count: ${merged.length}`);
            observer.next(merged);
            observer.complete();
          },
          error: (error) => {
            console.error('❌ Error fetching pets from backend:', error);
            // Fallback to local added pets only
            const localMatches = this.addedPets.filter(p => this.petMatchesFilters(p, filters!));
            observer.next(localMatches);
            observer.complete();
          }
        });
      });
    } else {
      // Get all pets from backend
      return new Observable(observer => {
        console.log('🌐 Attempting to fetch all pets from backend...');
        this.http.get<any[]>(`${this.apiUrl}/pets`).subscribe({
          next: (pets) => {
            console.log('✅ Backend response for all pets:', pets);
            const convertedPets = pets.map(this.convertBackendPetToFrontend);
            const merged = this.mergeUniquePets(convertedPets, this.addedPets);
            console.log(`📊 Total pets from backend: ${merged.length}`);
            
              observer.next(merged);
            observer.complete();
          },
          error: (error) => {
            console.error('❌ Error fetching all pets from backend:', error);
            // Fallback to local added pets only
            observer.next([...this.addedPets]);
            observer.complete();
          }
        });
      });
    }
  }

  private convertBackendPetToFrontend(backendPet: any): Pet {
    const shelterNameCandidates: Array<string | undefined> = [
      backendPet?.shelter?.shelterName,
      backendPet?.shelter?.name,
      backendPet?.shelterName,
      backendPet?.shelter_name,
      backendPet?.organizationName,
      backendPet?.orgName
    ];
    const resolvedShelterName = shelterNameCandidates.find(v => typeof v === 'string' && v.trim().length > 0)?.trim() || 'Unknown Shelter';

    return {
      id: backendPet.id.toString(),
      name: backendPet.name,
      breed: backendPet.breed,
      age: typeof backendPet.age === 'number' ? `${backendPet.age} years` : backendPet.age || 'Unknown',
      petType: backendPet.petType,
      gender: backendPet.gender,
      color: backendPet.color || '',
      description: backendPet.description || '',
      imageUrl: backendPet.imageUrl || 'assets/pets/default-pet.jpg',
      shelterId: backendPet.shelter?.id?.toString() || backendPet.shelterId?.toString() || '1',
      shelterName: resolvedShelterName,
      status: backendPet.status,
      location: backendPet.location || '',
      vaccinated: backendPet.vaccinated || false,
      createdAt: new Date(backendPet.createdAt),
      updatedAt: new Date(backendPet.updatedAt)
    };
  }


  getPetById(id: string): Observable<Pet | undefined> {
    return new Observable(observer => {
      console.log('🔍 PetService.getPetById called with ID:', id);
      // Check locally added pets first
      const local = this.addedPets.find(p => p.id === id);
      if (local) {
        console.log('✅ Found pet in local added pets:', local);
        observer.next(local);
        observer.complete();
        return;
      }
      console.log('🌐 Fetching pet from backend API...');
      this.http.get<any>(`${this.apiUrl}/pets/${id}`).subscribe({
        next: (pet) => {
          console.log('✅ Backend response for pet:', pet);
          if (pet) {
            const converted = this.convertBackendPetToFrontend(pet);
            console.log('✅ Converted pet:', converted);
            observer.next(converted);
          } else {
            console.log('❌ Pet is null/undefined from backend');
            observer.next(undefined);
          }
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error fetching pet from backend:', error);
          // Fallback to local added pets only
          const localPet = this.addedPets.find(p => p.id === id);
          observer.next(localPet);
          observer.complete();
        }
      });
    });
  }

  getFeaturedPets(): Observable<Pet[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/pets/featured`).subscribe({
        next: (pets) => {
          const convertedPets = pets.map(this.convertBackendPetToFrontend);
          observer.next(convertedPets);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error fetching featured pets from backend:', error);
          // Fallback to local added pets only
          const featuredPets = this.addedPets
            .filter(pet => pet.status === 'Available')
            .slice(0, 8);
          observer.next(featuredPets);
          observer.complete();
        }
      });
    });
  }

  addPet(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Observable<Pet> {
    // Prepare backend payload, attach shelter as nested object
    const backendPayload: any = {
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      petType: pet.petType,
      gender: pet.gender,
      color: pet.color,
      description: pet.description,
      imageUrl: pet.imageUrl,
      status: pet.status,
      location: pet.location,
      vaccinated: pet.vaccinated,
      shelter: pet.shelterId ? { id: Number(pet.shelterId) } : undefined
    };

    console.log('📝 Creating pet with payload:', backendPayload);

    return new Observable(observer => {
        this.http.post<any>(`${this.apiUrl}/pets`, backendPayload).subscribe({
          next: (response) => {
            console.log('✅ Backend response for pet creation:', response);
            const created = response.data || response;
            const converted = this.convertBackendPetToFrontend(created);
            console.log('✅ Converted pet:', converted);
            // Update local cache for immediate UI consistency
            this.addedPets.unshift(converted);
            this.saveAddedPetsToStorage();
            observer.next(converted);
            observer.complete();
          },
        error: (error) => {
          console.error('❌ Error creating pet via backend, falling back to local add:', error);
          // Fallback to local add to avoid data loss in UI
          const newPet: Pet = {
            ...pet,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          } as Pet;
          console.log('📝 Created local fallback pet:', newPet);
          this.addedPets.unshift(newPet);
          this.saveAddedPetsToStorage();
          observer.next(newPet);
          observer.complete();
        }
      });
    });
  }

  updatePet(id: string, updates: Partial<Pet>): Observable<Pet> {
    const backendPayload: any = { ...updates };
    if ((updates as any).shelterId) {
      backendPayload.shelter = { id: Number((updates as any).shelterId) };
      delete backendPayload.shelterId;
    }
    return new Observable(observer => {
      this.http.put<any>(`${this.apiUrl}/pets/${id}`, backendPayload).subscribe({
        next: (response) => {
          const updated = response.data || response;
          const converted = this.convertBackendPetToFrontend(updated);
          // Update local cache if exists
          const localIndex = this.addedPets.findIndex(p => p.id === id);
          if (localIndex !== -1) this.addedPets[localIndex] = converted;
          this.saveAddedPetsToStorage();
          observer.next(converted);
          observer.complete();
        },
        error: (error) => {
          console.error('Error updating pet via backend, falling back to local update:', error);
            const localIndex = this.addedPets.findIndex(p => p.id === id);
            if (localIndex !== -1) {
              this.addedPets[localIndex] = {
                ...this.addedPets[localIndex],
                ...updates,
                updatedAt: new Date()
              } as Pet;
            this.saveAddedPetsToStorage();
            observer.next(this.addedPets[localIndex]);
            observer.complete();
          } else {
            observer.error('Pet not found');
          }
        }
      });
    });
  }

  deletePet(id: string): Observable<boolean> {
    return new Observable(observer => {
      this.http.delete(`${this.apiUrl}/pets/${id}`).subscribe({
        next: () => {
          this.addedPets = this.addedPets.filter(p => p.id !== id);
          this.saveAddedPetsToStorage();
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error deleting pet via backend, falling back to local delete:', error);
          const index = this.addedPets.findIndex(p => p.id === id);
          if (index !== -1) {
            this.addedPets.splice(index, 1);
            this.saveAddedPetsToStorage();
            observer.next(true);
            observer.complete();
          } else {
            observer.error('Pet not found');
          }
        }
      });
    });
  }

  getBreeds(): Observable<string[]> {
    return new Observable(observer => {
      this.http.get<string[]>(`${this.apiUrl}/pets/breeds`).subscribe({
        next: (breeds) => {
          const merged = Array.from(new Set([...breeds, ...this.addedPets.map(p => p.breed)])).sort();
          observer.next(merged);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error fetching breeds:', error);
          // Fallback to local added pets only
          const breeds = [...new Set(this.addedPets.map(pet => pet.breed))];
          observer.next(breeds);
          observer.complete();
        }
      });
    });
  }

  getLocations(): Observable<string[]> {
    return new Observable(observer => {
      this.http.get<string[]>(`${this.apiUrl}/pets/locations`).subscribe({
        next: (locations) => {
          const merged = Array.from(new Set([...locations, ...this.addedPets.map(p => p.location)])).sort();
          observer.next(merged);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error fetching locations:', error);
          // Fallback to local added pets only
          const locations = [...new Set(this.addedPets.map(pet => pet.location))];
          observer.next(locations);
          observer.complete();
        }
      });
    });
  }

  // Helpers
  private parseAgeToNumber(ageString: string): number {
    const age = ageString.toLowerCase().trim();
    
    // Handle months
    if (age.includes('month')) {
      const months = parseInt(age.match(/\d+/)?.[0] || '0');
      return months / 12; // Convert months to years (e.g., 6 months = 0.5 years)
    }
    
    // Handle years
    if (age.includes('year')) {
      const years = parseInt(age.match(/\d+/)?.[0] || '0');
      return years;
    }
    
    // Handle mixed formats like "1 year 8 months"
    if (age.includes('year') && age.includes('month')) {
      const yearMatch = age.match(/(\d+)\s*year/);
      const monthMatch = age.match(/(\d+)\s*month/);
      const years = parseInt(yearMatch?.[1] || '0');
      const months = parseInt(monthMatch?.[1] || '0');
      return years + (months / 12);
    }
    
    // Fallback: try to extract any number
    const number = parseInt(age.match(/\d+/)?.[0] || '0');
    return number;
  }

  private mergeUniquePets(primary: Pet[], secondary: Pet[]): Pet[] {
    const seen = new Set(primary.map(p => p.id));
    const merged = [...primary];
    for (const p of secondary) {
      if (!seen.has(p.id)) merged.unshift(p);
    }
    return merged;
  }

  private petMatchesFilters(pet: Pet, filters: PetFilters): boolean {
    let ok = true;
    if (filters.breed) ok = ok && pet.breed.toLowerCase().includes(filters.breed.toLowerCase());
    if (filters.petType) ok = ok && pet.petType === filters.petType;
    if (filters.location) ok = ok && pet.location.toLowerCase().includes(filters.location.toLowerCase());
    if (filters.gender) ok = ok && pet.gender === filters.gender;
    if (filters.vaccinated !== undefined) ok = ok && pet.vaccinated === filters.vaccinated;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      ok = ok && (
        pet.name.toLowerCase().includes(s) ||
        pet.breed.toLowerCase().includes(s) ||
        pet.description.toLowerCase().includes(s)
      );
    }
    if (filters.age) {
      const ageRange = filters.age.split('-');
      if (ageRange.length === 2) {
        const minAge = parseInt(ageRange[0]);
        const maxAge = parseInt(ageRange[1]);
        const petAge = this.parseAgeToNumber(pet.age);
        ok = ok && petAge >= minAge && petAge <= maxAge;
      }
    }
    return ok;
  }

  // Backend helpers
  getShelterByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shelters/email/${encodeURIComponent(email)}`);
  }

  private loadAddedPetsFromStorage(): Pet[] {
    try {
      const raw = localStorage.getItem('addedPets');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as any[];
      return parsed.map(p => ({
        ...p,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date()
      })) as Pet[];
    } catch {
      return [];
    }
  }

  private saveAddedPetsToStorage(): void {
    try {
      localStorage.setItem('addedPets', JSON.stringify(this.addedPets));
    } catch {}
  }
}
