
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-paginator',
  imports: [],
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);  
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);  
    }
  }
}
