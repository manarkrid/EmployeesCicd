import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee, EmployeeService } from '../../services/employee.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'id', 'firstName', 'lastName', 'email', 'position', 'actions'];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  searchTerm: string = '';

  constructor(
    private service: EmployeeService,
    private snackBar: MatSnackBar,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.initialLoad();
    this.searchService.currentSearch.subscribe(term => {
      this.searchTerm = term;
      this.filterEmployees();
    });
  }

  initialLoad() {
    this.service.getAll().subscribe(data => {
      this.employees = data;
      this.filterEmployees();
    });
  }

  loadEmployees() {
    this.service.getAll().subscribe(data => {
      this.employees = data;
      this.filterEmployees();
    });
  }

  filterEmployees() {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees;
    } else {
      const lowerTerm = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp =>
        emp.firstName.toLowerCase().includes(lowerTerm) ||
        emp.lastName.toLowerCase().includes(lowerTerm) ||
        emp.position.toLowerCase().includes(lowerTerm)
      );
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      this.service.delete(id).subscribe(() => {
        this.loadEmployees();
        this.snackBar.open('Employé supprimé avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });
    }
  }
}
