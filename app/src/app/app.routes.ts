import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PetListingsComponent } from './components/pet-listings/pet-listings.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdoptionRequestsComponent } from './components/adoption-requests/adoption-requests.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminPetManagementComponent } from './components/admin/admin-pet-management/admin-pet-management.component';
import { AdminAdoptionRequestsComponent } from './components/admin/admin-adoption-requests/admin-adoption-requests.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports.component';
import { ShelterDashboardComponent } from './components/shelter/shelter-dashboard/shelter-dashboard.component';
import { ShelterPetManagementComponent } from './components/shelter/shelter-pet-management/shelter-pet-management.component';
import { ShelterAdoptionRequestsComponent } from './components/shelter/shelter-adoption-requests/shelter-adoption-requests.component';
import { ShelterReportsComponent } from './components/shelter/shelter-reports/shelter-reports.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ShelterGuard } from './guards/shelter.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'pets', component: PetListingsComponent },
  { path: 'pets/:id', component: PetDetailsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // User protected routes
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'my-requests', component: AdoptionRequestsComponent, canActivate: [AuthGuard] },

  // Admin protected routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/pets', component: AdminPetManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/requests', component: AdminAdoptionRequestsComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AdminUserManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [AdminGuard] },

  // Shelter protected routes
  { path: 'shelter', component: ShelterDashboardComponent, canActivate: [ShelterGuard] },
  { path: 'shelter/pets', component: ShelterPetManagementComponent, canActivate: [ShelterGuard] },
  { path: 'shelter/requests', component: ShelterAdoptionRequestsComponent, canActivate: [ShelterGuard] },
  { path: 'shelter/reports', component: ShelterReportsComponent, canActivate: [ShelterGuard] },

  // Redirect to home for unknown routes
  { path: '**', redirectTo: '' }
];
