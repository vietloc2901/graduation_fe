import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CatalogService } from 'app/core/service/catalog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CatalogsComponent } from '../catalogs.component';
import { CreateUpdateCatalogComponent } from '../create-update-catalog/create-update-catalog.component';

@Component({
  selector: 'jhi-action-catalog',
  templateUrl: './action-catalog.component.html',
  styleUrls: ['./action-catalog.component.scss'],
})
export class ActionCatalogComponent implements OnInit, ICellRendererAngularComp {
  rowIndex;
  cellValue: string;
  modalRef: BsModalRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private catalogService: CatalogService,
    private toast: ToastrService,
    private catalogs: CatalogsComponent,
    private matDialog: MatDialog
  ) {}

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
    dataEdit.isCreateNew = false;
    dataEdit.oldData = this.cellValue;
    this.matDialog
      .open(CreateUpdateCatalogComponent, {
        data: dataEdit,
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res.event != 'cancel') {
          this.catalogs.searchData();
        }
      });
  }

  deleteCatalog() {
    this.catalogService.delete(this.cellValue).subscribe(res => {
      if (res.status === 'OK') {
        this.toast.success(res.message);
        this.modalRef.hide();
        this.catalogs.searchData();
      } else {
        this.toast.error(res.message);
        this.modalRef.hide();
        this.catalogs.searchData();
      }
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'delete-popup-offical' }));
  }
}
