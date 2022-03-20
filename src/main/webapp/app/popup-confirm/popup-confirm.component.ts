import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent implements OnInit {
  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<PopupConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {}

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({ event: 'confirm' });
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({ event: 'cancel' });
  }
}
