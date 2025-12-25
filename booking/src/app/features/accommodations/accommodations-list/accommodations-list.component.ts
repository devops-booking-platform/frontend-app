import { Component } from '@angular/core';
import { SearchRequest, SearchResult } from '../../../shared/models/search.model';
import { SearchService } from '../../../core/services/search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, catchError, of } from 'rxjs';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';

@Component({
  selector: 'app-accommodations-list',
  templateUrl: './accommodations-list.component.html',
  styleUrl: './accommodations-list.component.css'
})
export class AccommodationsListComponent {

  form = new FormGroup({
    city: new FormControl<string | null>(null),
    country: new FormControl<string | null>(null),
    guests: new FormControl(1, Validators.required),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  results: SearchResult[] = [];
  searched = false;

  sortColumn: keyof SearchResult | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private searchService: SearchService,
    private snackbar: SnackbarNotificationService
  ) { }

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = { ...this.form.value } as SearchRequest;

    request.start = new Date(request.start!).toISOString();
    request.end = new Date(request.end!).toISOString();

    this.searchService.search(request)
      .pipe(
        tap(() => {
          this.searched = true;
        }),
        catchError(err => {
          this.snackbar.error(
            err?.error?.detail || 'Search failed. Please try again.'
          );
          this.results = [];
          this.searched = true;
          return of([]);
        })
      )
      .subscribe(res => {
        this.results = res;
      });
  }


  sort(column: keyof SearchResult): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.results = [...this.results].sort((a, b) => {
      const x = a[column];
      const y = b[column];

      if (x == null || y == null) return 0;

      return this.sortDirection === 'asc'
        ? x > y ? 1 : -1
        : x < y ? 1 : -1;
    });
  }

}
