import { Action } from 'rxjs/internal/scheduler/Action';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Employee, EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule, MatSelectModule, MatIconModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = { firstName: '', lastName: '', email: '', position: '', gender: '', photo: '' };
  isEdit = false;

  constructor(
    private service: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.service.get(id).subscribe(data => this.employee = data);
    }
  }

  saveEmployee() {
    if (this.isEdit && this.employee.id) {
      this.service.update(this.employee.id, this.employee).subscribe(() => {
        this.showNotification('Employé mis à jour avec succès');
        this.router.navigate(['/employees']);
      });
    } else {
      this.service.create(this.employee).subscribe(() => {
        this.showNotification('Employé ajouté avec succès');
        this.router.navigate(['/employees']);
      });
    }
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
