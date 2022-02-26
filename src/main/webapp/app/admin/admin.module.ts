import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UserManagementComponent } from './user-management/user-management.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    UserManagementComponent, CatalogsComponent, OrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AgGridModule.withComponents([])
  ]
})
export class AdminModule { }
