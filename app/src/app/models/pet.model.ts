export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  gender: 'Male' | 'Female';
  color: string;
  description: string;
  imageUrl: string;
  shelterId: string;
  shelterName: string;
  status: 'Available' | 'Adopted' | 'Pending';
  location: string;
  vaccinated: boolean;
  spayedNeutered: boolean;
  specialNeeds: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetFilters {
  breed?: string;
  age?: string;
  size?: string;
  location?: string;
  gender?: string;
  vaccinated?: boolean;
  spayedNeutered?: boolean;
  search?: string;
}
