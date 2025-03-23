import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  links = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Imprint', path: '/imprint' },
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'Settings', path: '/settings' },
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
  ];

  visibleLinks = [...this.links];
  hiddenLinks: any[] = [];
  showDropdown = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateVisibleLinks();
  }

  ngOnInit() {
    this.updateVisibleLinks();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  private updateVisibleLinks() {
    const navElement = document.querySelector('nav');
    const routesMainElement = document.querySelector('.routes-main');
    const logoElement = document.querySelector('.logo');

    // If any required DOM elements are missing, show all links as visible
    if (!navElement || !routesMainElement || !logoElement) {
      this.visibleLinks = [...this.links];
      this.hiddenLinks = [];
      return;
    }

    const containerWidth = navElement.clientWidth;
    const logoWidth = logoElement.clientWidth;

    // Calculate available width for links
    const availableWidth = containerWidth - logoWidth - 300;

    // Approximate width of each link (adjust based on actual styles)
    const linkWidth = 60;

    // Calculate the maximum number of links that can fit in the available space
    const maxVisibleLinks = Math.floor(availableWidth / linkWidth);

    // Ensure visibleLinks and hiddenLinks are set correctly
    if (maxVisibleLinks >= this.links.length) {
      // All links fit in the available space
      this.visibleLinks = [...this.links];
      this.hiddenLinks = [];
    } else if (maxVisibleLinks <= 0) {
      // No links fit in the available space
      this.visibleLinks = [];
      this.hiddenLinks = [...this.links];
    } else {
      // Split links into visible and hidden based on available space
      this.visibleLinks = this.links.slice(0, maxVisibleLinks);
      this.hiddenLinks = this.links.slice(maxVisibleLinks);
    }
  }
}
