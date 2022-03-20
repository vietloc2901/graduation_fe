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
    this.cartService.getCart().subscribe(res => {
      if (res.status == 'UNAUTHORIZED') {
      }
    });
  }

  ngOnInit(): void {}
}
