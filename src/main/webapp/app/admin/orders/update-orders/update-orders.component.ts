import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'app/core/service/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'jhi-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss']
})
export class UpdateOrdersComponent implements OnInit {

  form1: FormGroup;
  listProducts = []
  listStatus = [
    {
      id: 'WAITING',
      name: 'Đang chờ',
    },
    {
      id: 'PREPARING',
      name: 'Đang chuẩn bị',
    },
    {
      id: 'TRANSFERING',
      name: 'Đang giao',
    },
    {
      id: 'DONE',
      name: 'Hoàn thành',
    },
    {
      id: 'CANCEL',
      name: 'Hủy',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateOrdersComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {
    this.buildForm1();
    console.log(data);
    this.orderService.findById(data).subscribe((res) => {
      this.listProducts = res.listItem;
      this.form1 = this.formBuilder.group({
        id: [res.id],
        name: [res.name],
        receiverName: [res.receiverName],
        phone: [res.phone],
        receiverPhone: [res.receiverPhone],
        email: [res.email],
        address: [res.address],
        status: [res.status],
        lastModifiedBy: [res.lastModifiedBy],
        lastModifiedDateString: [this.dateFormatter(res.lastModifiedDate)],
        note: [res.note],
        sumPriceString: [this.formatCurrency(res.sumPrice)]
      })
    })
   }

  ngOnInit(): void {
  }


  buildForm1() {
    this.form1 = this.formBuilder.group({
      id: [null],
      name: [null],
      receiverName: [null],
      phone: [null],
      receiverPhone: [null],
      email: [null],
      address: [null],
      status: [null],
      lastModifiedBy: [null],
      lastModifiedDateString: [null],
      note: [null],
      sumPriceString: [null]
    });
  }


  closeModal() {
    // this.files =[];
    // this.form1.reset;
    this.dialogRef.close({ event: 'cancel' });
  }

  formatCurrency(params) {
    return params.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
  }

  dateFormatter(params) {
    return new Date(Date.parse(params)).toLocaleString();
  }

  updateOrder(){
    let data = this.form1.value;
    this.orderService.updateStatus(data).subscribe((res) => {
      if(res.status == 'OK'){
        this.toastr.success("Cập nhật thành công!")
        this.dialogRef.close({ event: 'add' });
      }else{
        this.toastr.error("Lỗi khi cập nhật đơn hàng. Thử lại sau!")
      }
    })
  }

}
