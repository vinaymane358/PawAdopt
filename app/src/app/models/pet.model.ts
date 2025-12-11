export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  petType: 'dog' | 'cat' | 'other';
  gender: 'Male' | 'Female';
  color: string;
  description: string;
  imageUrl: string;
  shelterId: string;
  shelterName: string;
  status: 'Available' | 'Adopted' | 'Pending';
  location: string;
  vaccinated: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageLoaded?: boolean;
}

export interface PetFilters {
  breed?: string;
  age?: string;
  petType?: string;
  location?: string;
  gender?: string;
  vaccinated?: boolean;
  search?: string;
}
