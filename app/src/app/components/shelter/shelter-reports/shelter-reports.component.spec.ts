import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ShelterReportsComponent } from './shelter-reports.component';

describe('ShelterReportsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ShelterReportsComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShelterReportsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});


