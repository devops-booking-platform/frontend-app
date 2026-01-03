import { Component } from '@angular/core';
import { SearchRequest, SearchResult } from '../../../shared/models/search.model';
import { SearchService } from '../../../core/services/search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, catchError } from 'rxjs';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';

@Component({
  selector: 'app-accommodations-list',
  templateUrl: './accommodations-list.component.html',
  styleUrl: './accommodations-list.component.css'
})
export class AccommodationsListComponent {
  Math = Math;
  form = new FormGroup({
    city: new FormControl<string | null>(null),
    country: new FormControl<string | null>(null),
    guests: new FormControl(1, Validators.required),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  results: SearchResult[] = [];
  searched = false;

  // Pagination
  page = 1;
  pageSize = 10;
  totalCount = 0;

  // Sorting
  sortColumn: keyof SearchResult | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private searchService: SearchService,
    private snackbar: SnackbarNotificationService
  ) { }

  search(page: number = 1): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.page = page;

    const request = {
      ...this.form.value,
      page: this.page,
      pageSize: this.pageSize
    } as SearchRequest;

    request.start = this.toDateOnlyString(request.start!);
    request.end = this.toDateOnlyString(request.end!);

    this.searchService.search(request)
      .pipe(
        tap(() => (this.searched = true)),
        catchError(err => {
          this.snackbar.error(err?.error?.detail || 'Search failed.');
          this.results = [];
          this.totalCount = 0;
          this.searched = true;
          throw err;
        })
      )
      .subscribe(res => {
        this.results = res.items;
        this.totalCount = res.totalCount;
        this.page = res.page;
        this.pageSize = res.pageSize;
      });
  }

  // Sorting triggers new search
  sort(column: keyof SearchResult): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // After setting sorting, reload page 1
    this.search(1);
  }

  // Pagination click
  onPageChange(page: number): void {
    this.search(page);
  }

  private toDateOnlyString(value: string): string {
    return new Date(value).toISOString().split('T')[0];
  }

}
