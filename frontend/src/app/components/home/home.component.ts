import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatCardModule, MatIconModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  maleCount = 0;
  femaleCount = 0;

  constructor(private service: EmployeeService) { }

  ngOnInit(): void {
    this.service.getAll().subscribe(employees => {
      console.log('All employees:', employees);
      console.log('Employee genders:', employees.map(e => ({ name: `${e.firstName} ${e.lastName}`, gender: e.gender })));

      // Count with case-insensitive and trim to handle variations
      this.maleCount = employees.filter(e => {
        const gender = e.gender?.trim().toLowerCase();
        return gender === 'homme' || gender === 'male' || gender === 'm';
      }).length;

      this.femaleCount = employees.filter(e => {
        const gender = e.gender?.trim().toLowerCase();
        return gender === 'femme' || gender === 'female' || gender === 'f';
      }).length;

      console.log('Male count:', this.maleCount);
      console.log('Female count:', this.femaleCount);
    });
  }
}





