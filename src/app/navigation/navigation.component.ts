import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('utilityRef') utilityRef!: ElementRef;
  showDropdown = false;
  isCollapsed = false;

  ngOnInit() {
    this.checkOverflow();
    window.addEventListener('resize', this.checkOverflow.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkOverflow.bind(this));
  }

  checkOverflow() {
    if (this.utilityRef && this.utilityRef.nativeElement) {
      const { scrollWidth, clientWidth } = this.utilityRef.nativeElement;
      this.isCollapsed = scrollWidth > clientWidth;
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
