import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../core/services/reservation.service';
import { PagedResult } from '../../../shared/models/paged.model';
import { GetReservationRequest, GetReservationResponse } from '../../../shared/models/reservations.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';

@Component({
  selector: 'app-reservations-view',
  templateUrl: './reservations-view.component.html',
  styleUrl: './reservations-view.component.css'
})
export class ReservationsViewComponent implements OnInit {

  reservations?: PagedResult<GetReservationResponse>;

  statusFilter: 'None' | 'Pending' | 'Approved' | 'Rejected' | 'CancelledByGuest' = 'Approved';
  Math = Math;
  // Pagination
  page = 1;
  pageSize = 10;
  statusLabels: Record<number, string> = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Cancelled By Guest'
  };
  // Sorting
  sortColumn: keyof GetReservationResponse | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private reservationService: ReservationService, private notificationService: SnackbarNotificationService) { }

  ngOnInit(): void {
    this.getReservations();
  }

  applyFilters() {
    this.page = 1;
    this.getReservations();
  }

  sort(column: keyof GetReservationResponse) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.getReservations();
  }

  onPageChange(page: number) {
    this.page = page;
    this.getReservations();
  }

  getReservations(): void {
    const request: GetReservationRequest = {
      reservationStatus: this.statusFilter === 'None' ? null : this.statusFilter,
      page: this.page,
      pageSize: this.pageSize
    };

    this.reservationService.search(request).subscribe(res => {
      this.reservations = res;
      this.page = res.page;
      this.pageSize = res.pageSize;
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? 'Unknown';
  }

  cancelReservation(id: string): void {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    this.reservationService.cancelReservation(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Reservation cancelled successfully.');
          this.getReservations();
        },
        error: (err) => {
          const errorMsg = err?.error?.detail || 'Failed to cancel reservation.';
          this.notificationService.error(errorMsg);
        }
      });
  }
}