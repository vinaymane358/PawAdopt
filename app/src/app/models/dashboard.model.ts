export interface DashboardStats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  pendingRequests: number;
  approvedRequests: number;
  totalUsers: number;
  activeUsers: number;
}

export interface AdoptionTrend {
  month: string;
  adoptions: number;
}

export interface BreedPopularity {
  breed: string;
  count: number;
  percentage: number;
}

export interface ShelterActivity {
  shelterName: string;
  totalPets: number;
  adoptions: number;
  pendingRequests: number;
}
