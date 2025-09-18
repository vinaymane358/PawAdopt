import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { AdoptionTrend, BreedPopularity, ShelterActivity } from '../../../models/dashboard.model';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  selectedPeriod = '6months';
  selectedReportType = 'overview';

  totalPets = 0;
  totalAdoptions = 0;
  totalUsers = 0;
  totalShelters = 0;

  adoptionTrends: AdoptionTrend[] = [];
  breedPopularity: BreedPopularity[] = [];
  shelterActivity: ShelterActivity[] = [];
  maxAdoptions = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadReportData();
  }

  loadReportData() {
    this.dashboardService.getAdoptionTrends().subscribe({
      next: (trends) => {
        this.adoptionTrends = trends;
        this.maxAdoptions = Math.max(...trends.map(t => t.adoptions));
        this.totalAdoptions = trends.reduce((sum, trend) => sum + trend.adoptions, 0);
      },
      error: (error) => {
        console.error('Error loading adoption trends:', error);
      }
    });

    this.dashboardService.getBreedPopularity().subscribe({
      next: (breeds) => {
        this.breedPopularity = breeds;
        this.totalPets = breeds.reduce((sum, breed) => sum + breed.count, 0);
      },
      error: (error) => {
        console.error('Error loading breed popularity:', error);
      }
    });

    this.dashboardService.getShelterActivity().subscribe({
      next: (activity) => {
        this.shelterActivity = activity;
        this.totalShelters = activity.length;
      },
      error: (error) => {
        console.error('Error loading shelter activity:', error);
      }
    });

    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.totalUsers = stats.totalUsers;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  updateReports() {
    // In a real app, this would reload data based on selected filters
    console.log('Updating reports for period:', this.selectedPeriod, 'type:', this.selectedReportType);
  }

  exportReport() {
    // In a real app, this would generate and download a report
    alert('Report export functionality would be implemented here. This would generate a PDF or Excel file with the current report data.');
  }

  getSuccessRateColor(rate: number): string {
    if (rate >= 0.7) return '#10b981'; // Green
    if (rate >= 0.5) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  }
}
