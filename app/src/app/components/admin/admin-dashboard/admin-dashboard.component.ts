import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardStats, AdoptionTrend, BreedPopularity, ShelterActivity } from '../../../models/dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  adoptionTrends: AdoptionTrend[] = [];
  breedPopularity: BreedPopularity[] = [];
  shelterActivity: ShelterActivity[] = [];
  maxAdoptions = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    this.dashboardService.getAdoptionTrends().subscribe({
      next: (trends) => {
        this.adoptionTrends = trends;
        this.maxAdoptions = Math.max(...trends.map(t => t.adoptions));
      },
      error: (error) => {
        console.error('Error loading adoption trends:', error);
      }
    });

    this.dashboardService.getBreedPopularity().subscribe({
      next: (breeds) => {
        this.breedPopularity = breeds;
      },
      error: (error) => {
        console.error('Error loading breed popularity:', error);
      }
    });

    this.dashboardService.getShelterActivity().subscribe({
      next: (activity) => {
        this.shelterActivity = activity;
      },
      error: (error) => {
        console.error('Error loading shelter activity:', error);
      }
    });
  }
}
