import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'app/core/service/cart.service';
import { ProductService } from 'app/core/service/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  listCartItem;

  constructor(
    private productService: ProductService,
    public router: Router,
    private route: ActivatedRoute,
    private toaStr: ToastrService,
    private cartService: CartService
  ) {
    this.getCart();
    this.getUser();
  }

  getUser() {
    // this.cartService.getUserInfor().subscribe((res) => {
    // })
  }

  money = 0;
  send = {
    name: {
      value: '',
      error: false,
      message: '',
    },
    phone: {
      value: '',
      error: false,
      message: '',
    },
    email: {
      value: '',
      error: false,
      message: '',
    },
    address: {
      value: '',
      error: false,
      message: '',
    },
    receiverName: {
      value: '',
      error: false,
      message: '',
    },
    receiverPhone: {
      value: '',
      error: false,
      message: '',
    },
  };

  formatCurrency(params) {
    return params.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
  }

  remove(item) {
    this.cartService.remove(item);
    this.getCart();
  }

  create() {
    if (this.send.name.value == undefined || this.send.name.value == null || this.send.name.value.trim() == '') {
      this.toaStr.error('Tên người đặt không được để trống!');
      return;
    }
    if (this.send.phone.value == undefined || this.send.phone.value == null || this.send.phone.value.trim() == '') {
      this.toaStr.error('SĐT người đặt không được để trống!');
      return;
    }
    if (this.send.receiverName.value == undefined || this.send.receiverName.value == null || this.send.receiverName.value.trim() == '') {
      this.toaStr.error('Tên người nhận không được để trống!');
      return;
    }
    if (this.send.receiverPhone.value == undefined || this.send.receiverPhone.value == null || this.send.receiverPhone.value.trim() == '') {
      this.toaStr.error('SĐT người nhận không được để trống!');
      return;
    }
    if (this.send.address.value == undefined || this.send.address.value == null || this.send.address.value.trim() == '') {
      this.toaStr.error('Địa chỉ người nhận không được để trống!');
      return;
    }

    let data = {
      name: this.send.name.value,
      phone: this.send.phone.value,
      address: this.send.address.value,
      email: this.send.email.value,
      receiverName: this.send.receiverName.value,
      receiverPhone: this.send.receiverPhone.value,
      listItem: this.listCartItem,
    };

    this.cartService.createOrder(data).subscribe(res => {
      if (res.status == 'OK') {
        this.toaStr.success('Đặt hàng thành công!');
        this.cartService.removeCart();
        this.router.navigate(['']);
      }
    });
  }

  getCart() {
    this.money = 0;
    this.listCartItem = this.cartService.getCart();
    this.listCartItem.forEach(val => {
      this.money += val.price * val.quantity;
    });
  }

  routerToDetails(item) {
    this.router.navigate(['product-detail', item.id]);
  }

  ngOnInit(): void {}
}
