import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarNotificationService {

    constructor(private snackBar: MatSnackBar) { }

    success(message: string, duration: number = 2000) {
        this.snackBar.open(message, 'Close', {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['my-custom-snackbar']
        });
    }

    error(message: string, duration: number = 3000) {
        this.snackBar.open(message, 'Close', {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['my-custom-snackbar']
        });
    }
}
