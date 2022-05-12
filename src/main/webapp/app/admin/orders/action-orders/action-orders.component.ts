import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrdersComponent } from '../orders.component';
import { UpdateOrdersComponent } from '../update-orders/update-orders.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-action-orders',
  templateUrl: './action-orders.component.html',
  styleUrls: ['./action-orders.component.scss']
})
export class ActionOrdersComponent implements OnInit {

  rowIndex;
  cellValue: string;
  modalRef: BsModalRef;

  constructor(private orderComponent: OrdersComponent, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    return true;
  }

  openModalUpdate() {
    const dataEdit: any = this.cellValue;
    this.matDialog
      .open(UpdateOrdersComponent, {
        data: dataEdit,
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '1000px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res.event != 'cancel') {
          this.orderComponent.search(this.orderComponent.page);
        }
      });
  }

}
