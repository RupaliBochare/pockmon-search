import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../paginator/paginator.component';


interface Encounter {
  location_area: { name: string };
  version_details: { version: { name: string }; max_chance: number }[];
}

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {

  @Input() set encounters(value: Encounter[]) {
    this.encounterData.set(value);
    this.totalPages.set(Math.ceil(value.length / this.limit));
    this.currentPage.set(1);
  }

  encounterData = signal<Encounter[]>([]);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);
  limit = 10;

  paginatedEncounters(): Encounter[] {
    const start = (this.currentPage() - 1) * this.limit;
    return this.encounterData().slice(start, start + this.limit);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
}
