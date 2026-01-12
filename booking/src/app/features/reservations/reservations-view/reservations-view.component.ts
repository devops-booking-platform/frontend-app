import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../core/services/reservation.service';
import { PagedResult } from '../../../shared/models/paged.model';
import { GetReservationRequest, GetReservationResponse } from '../../../shared/models/reservations.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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
  role = '';
  today: string = new Date().toISOString().split('T')[0];
  constructor(private reservationService: ReservationService,
    private notificationService: SnackbarNotificationService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.getReservations();
    this.authService.currentRole$
      .subscribe(role => this.role = role);
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

  acceptReservation(id: string): void {
    this.reservationService.approveReservation(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Reservation approved successfully.');
          this.getReservations();
        },
        error: (err) => {
          const errorMsg = err?.error?.detail || 'Failed to approve reservation.';
          this.notificationService.error(errorMsg);
        }
      });
  }

  declineReservation(id: string): void {
    if (!confirm('Are you sure you want to decline this reservation?')) {
      return;
    }
    this.reservationService.declineReservation(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Reservation declined successfully.');
          this.getReservations();
        },
        error: (err) => {
          const errorMsg = err?.error?.detail || 'Failed to decline reservation.';
          this.notificationService.error(errorMsg);
        }
      });
  }

  rate(reservation: GetReservationResponse, isHost: boolean = true): void {
    if (isHost) {
      this.router.navigate(['ratings/host'], { queryParams: { reservationId: reservation.id, hostId: reservation.hostId } });
      return;
    }
    this.router.navigate(['ratings/accommodation'], { queryParams: { reservationId: reservation.id, accommodationId: reservation.accommodationId } });
  }
}