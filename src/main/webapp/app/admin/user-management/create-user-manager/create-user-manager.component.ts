import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService } from 'app/core/service/catalog.service';
import { UserService } from 'app/core/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-create-user-manager',
  templateUrl: './create-user-manager.component.html',
  styleUrls: ['./create-user-manager.component.scss']
})
export class CreateUserManagerComponent implements OnInit {

  nodes: any = [];
  form1: FormGroup;
  isSubmit = false;

  login = {
    value: null,
    error: null,
    message: '',
  };

  password = {
    value: null,
    error: null,
    message: '',
  };

  repass = {
    value: null,
    error: null,
    message: '',
  };

  email = {
    value: null,
    error: null,
    message: '',
  };

  constructor(
    public dialogRef: MatDialogRef<CreateUserManagerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.buildForm1();
  }

  ngOnInit(): void {
  }


  buildForm1() {
    this.form1 = this.formBuilder.group({
      login: [null],
      password: [null],
      repass: [null],
      email: [null],
    });
    setTimeout(() => {
      this.resetData();
    }, 0);
  }

  resetData() {
    this.login.value = null;
    this.password.value = null;
    this.repass.value = null;
    this.email.value = null;
    setTimeout(() => {
      this.login.error = false;
      this.password.error = false;
      this.repass.error = false;
      this.email.error = false;
    }, 100);
  }

  closeModal() {
    // this.files =[];
    // this.form1.reset;
    this.dialogRef.close({ event: 'cancel' });
  }

  //====================Validate===================

  validateLogin(){
    const pattern = /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-_ )(><?.,]{1,50}$/;
    if (this.login.value == null || this.login.value == undefined || this.login.value == '') {
      this.login.error = true;
      this.login.message = 'Tên đăng nhập không được để trống';
    } else {
        if (this.login.value.trim().length > 50) {
          this.login.error = true;
          this.login.message = 'Tên đăng nhập không quá 50 ký tự';
        } else {
          this.login.error = false;
          this.login.message = '';
        }
    }
  }

  validatePassword(){
    console.log(this.password.value)
    if (this.password.value == null || this.password.value == undefined || this.password.value == '') {
      this.password.error = true;
      this.password.message = 'Mật khẩu không được để trống';
    } else {
        if (this.password.value.trim().length > 50) {
          this.password.error = true;
          this.password.message = 'Mật khẩu không quá 50 ký tự';
        } else if(this.password.value != this.repass.value){
            this.repass.error = true;
            this.repass.message = 'Mật khẩu không khớp';
        }else {
          this.password.error = false;
          this.password.message = '';
          this.repass.error = false;
          this.repass.message = '';
        }
      }
  }

  validateRepass(){
    this.validatePassword()
    if (this.repass.value == null || this.repass.value == undefined || this.repass.value == '') {
      this.repass.error = true;
      this.repass.message = 'Xác nhận mật khẩu không được để trống';
    } else {
        if (this.password.value != this.repass.value) {
          this.repass.error = true;
          this.repass.message = 'Mật khẩu không khớp';
        } else {
          this.repass.error = false;
          this.repass.message = '';
        }
      }
  }

  validateEmail(){
    if (this.email.value == null || this.email.value == undefined || this.email.value == '') {
      this.email.error = true;
      this.email.message = 'Email không được để trống';
    } else {
        this.repass.error = false;
        this.repass.message = '';
      }
  }
 
  createUser(){
    this.validateLogin();
    this.validatePassword();
    this.validateRepass();
    this.validateEmail();

    if(this.login.error || this.password.error || this.repass.error || this.email.error){
      return;
    }

    let data = {
      login: this.login.value,
      password: this.password.value,
      email: this.email.value
    }

    this.userService.createUser(data).subscribe((res) => {
      if(res.status == 'INTERNAL_SERVER_ERROR'){
        this.toastr.error("Tên đăng nhập đã tồn tại");
      }else if(res.status == 'INSUFFICIENT_STORAGE'){
        this.toastr.error("Email đã được đăng ký");
      }else if(res.status == 'OK'){
        this.toastr.success("Tạo thành công");
        this.dialogRef.close({event: 'create'})
      }
    })

  }
  
}
