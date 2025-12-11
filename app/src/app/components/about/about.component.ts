import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Add any initialization logic here
    console.log('About component initialized');
  }
  
  ngOnDestroy() {
    // Clean up any subscriptions or timers if needed
    console.log('About component destroyed');
  }
}
