import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit{
  @ViewChild('navRef', {static: true}) navElement!: ElementRef;
  @ViewChild('utilityRef', {static: true}) utilityRef!: ElementRef;
  @ViewChild('mainRoutes', {static: true}) routesMainElement!: ElementRef;
  @ViewChild('logo', {static: true}) logoElement!: ElementRef;
 

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

  @HostListener('window:resize')
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
    if (!this.navElement || !this.routesMainElement || !this.logoElement || !this.utilityRef) {
      this.visibleLinks = [...this.links];
      this.hiddenLinks = [];
      return;
    }
  
    // Get actual widths
    const containerWidth = this.navElement.nativeElement.clientWidth;
    const logoWidth = this.logoElement.nativeElement.clientWidth;
    const mainRoutesWidth = this.routesMainElement.nativeElement.clientWidth;

    // Dynamically calculate available width for utility links
    const availableWidth = containerWidth - logoWidth - 300;
    // Get all existing utility links (before moving to dropdown)

    const utilityLinks = Array.from(this.utilityRef.nativeElement.children) as HTMLElement[];
  
   
    let totalUtilityWidth = 0;
    utilityLinks.forEach((link) => (totalUtilityWidth += link.getBoundingClientRect().width));
    const perlinkWidth = Math.floor(totalUtilityWidth/ this.links.length +20 ) // here some space
    
     // Calculate total width of visible utility links
    let maxVisibleLinks = Math.floor(availableWidth / perlinkWidth);
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
  
  /**
   * Get the actual width of a utility link dynamically
   */
  private getLinkWidth(index: number): number {
    const linkElements = this.utilityRef?.nativeElement.children || [];
    if (linkElements[index]) {
      return linkElements[index].getBoundingClientRect().width;
    }
    return 0; // Default fallback
  }
 
  
}
