import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private service: EmployeeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.service.get(id).subscribe(data => this.employee = data);
    }
  }

  getAvatarUrl(employee: Employee): string {
    if (employee.photo) return employee.photo;
    return `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=random&size=200`;
  }
}
