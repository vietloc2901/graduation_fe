import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProductsComponent } from '../products.component';

@Component({
  selector: 'jhi-action-product',
  templateUrl: './action-product.component.html',
  styleUrls: ['./action-product.component.scss'],
})
export class ActionProductComponent implements OnInit {
  rowIndex;
  cellValue: string;
  modalRef: BsModalRef;

  constructor(private product: ProductsComponent) {}

  ngOnInit(): void {}

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    return true;
  }

  openModalUpdate() {
    const dataEdit: any = {};
    dataEdit.oldData = this.cellValue;
    this.product.routerToUpdatePage(dataEdit.oldData.id);
  }
}
