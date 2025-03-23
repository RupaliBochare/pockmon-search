import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Encounter {
  location_area: { name: string };
  version_details: { version: { name: string }; max_chance: number }[];
}

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  @Input() encounters: Encounter[] = [];
  currentPage = 1;
  limit = 10;

  // paginatedEncounters(): Encounter[] {
  //   const start = (this.currentPage - 1) * this.limit;
  //   return this.encounters.slice(start, start + this.limit);
  // }
}