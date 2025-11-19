import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  username: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.apiService.getCurrentUser();
    this.username = user?.username || 'User';

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/main-page']
      },
      {
        label: 'Moje CV',
        icon: 'pi pi-folder',
        routerLink: ['/my-cvs']
      },
      {
        label: 'Stwórz CV',
        icon: 'pi pi-plus',
        routerLink: ['/create-cv']
      },
      {
        label: this.username,
        icon: 'pi pi-user',
        items: [
          {
            label: 'Wyloguj',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ];
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
