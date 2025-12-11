import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  loading = false;
  alertMessage = '';
  alertType = '';
  
  private alertTimeout: any;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {}

  submitContactForm() {
    if (this.contactForm.valid) {
      this.loading = true;
      this.alertMessage = '';

      // Mock form submission
      setTimeout(() => {
        this.loading = false;
        this.showAlert('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        this.contactForm.reset();
      }, 2000);
    }
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    
    // Auto-hide alert after 5 seconds
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    
    this.alertTimeout = setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
  
  ngOnDestroy() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
}
