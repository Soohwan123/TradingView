import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>
        <mat-card-title class="my-primary-text">
          Confirm Deletion
        </mat-card-title>
    </h1>
    <div mat-dialog-content>Are you sure to delete it?</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Yes</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
