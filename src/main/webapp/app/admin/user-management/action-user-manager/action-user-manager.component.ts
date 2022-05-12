import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserManagementComponent } from '../user-management.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/core/service/user.service';

@Component({
  selector: 'jhi-action-user-manager',
  templateUrl: './action-user-manager.component.html',
  styleUrls: ['./action-user-manager.component.scss']
})
export class ActionUserManagerComponent implements OnInit, ICellRendererAngularComp {

  rowIndex;
  cellValue: any;
  modalRef: BsModalRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private toast: ToastrService,
    private userManagement: UserManagementComponent,
    private matDialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    return true;
  }

  
  updateUser() {
    this.userService.updateUser(this.cellValue).subscribe((res) => {
      if(res.status == 'INTERNAL_SERVER_ERROR'){
        this.toast.error("Người dùng không tồn tại")
      }else if(res.status == 'OK'){
        this.toast.success("Cập nhật thành công")
        this.modalRef.hide();
        this.userManagement.search(this.userManagement.page);
      }
    })
  }

  getActionName(){
    if(this.cellValue.activated){
      return 'Vô hiệu hóa';
    }else{
      return 'Kích hoạt'
    }
  }

  getHeaderName(){
    if(this.cellValue.activated){
      return 'VÔ HIỆU HÓA TÀI KHOẢN';
    }else{
      return 'KÍCH HOẠT TÀI KHOẢN'
    }
  }

  getContent(){
    if(this.cellValue.activated){
      return 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?';
    }else{
      return 'Bạn có chắc chắn muốn kích hoạt tài khoản này?'
    }
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'delete-popup-offical' }));
  }

}
