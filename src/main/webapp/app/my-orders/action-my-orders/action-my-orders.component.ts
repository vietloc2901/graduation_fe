import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MyOrdersComponent } from '../my-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { MyOrderDetailsComponent } from '../my-order-details/my-order-details.component';
import { OrderService } from 'app/core/service/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'jhi-action-my-orders',
  templateUrl: './action-my-orders.component.html',
  styleUrls: ['./action-my-orders.component.scss']
})
export class ActionMyOrdersComponent implements OnInit {

  rowIndex;
  cellValue;
  modalRef: BsModalRef;

  constructor(private toast: ToastrService, private orderComponent: MyOrdersComponent, private matDialog: MatDialog, private modalService: BsModalService, private orderService: OrderService) {}

  ngOnInit(): void {}

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
    console.log(this.cellValue)
  }

  refresh(params) {
    return true;
  }

  checkCancel(){
    return this.cellValue.status == 'WAITING';
  }

  openModalUpdate() {
    const dataEdit: any = this.cellValue;
    this.matDialog
      .open(MyOrderDetailsComponent, {
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

  openCancel(template: TemplateRef<any>){
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'delete-popup-offical' }));
  }

  cancelOrder(){
    this.orderService.cancel(this.cellValue).subscribe(res => {
      if (res.status === 'OK') {
        this.toast.success(res.message);
        this.modalRef.hide();
        this.orderComponent.search(this.orderComponent.page);
      } else {
        this.toast.error(res.message);
        this.modalRef.hide();
        this.orderComponent.search(this.orderComponent.page);
      }
    });
  }
}
