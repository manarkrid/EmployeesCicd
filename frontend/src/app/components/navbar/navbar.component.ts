import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchTerm: string = '';

  constructor(private searchService: SearchService, private router: Router) { }

  onSearch() {
    this.searchService.changeSearch(this.searchTerm);
    if (this.router.url !== '/employees') {
      this.router.navigate(['/employees']);
    }
  }
}
