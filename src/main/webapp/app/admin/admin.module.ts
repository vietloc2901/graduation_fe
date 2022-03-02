import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management/user-management.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { OrdersComponent } from './orders/orders.component';
import { httpInterceptorProviders } from 'app/core/interceptor';
import { ActionCatalogComponent } from './catalogs/action-catalog/action-catalog.component';
import { CreateUpdateCatalogComponent } from './catalogs/create-update-catalog/create-update-catalog.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    UserManagementComponent, CatalogsComponent, OrdersComponent, ActionCatalogComponent, CreateUpdateCatalogComponent
  ],
  imports: [
    AdminRoutingModule,
    FormsModule,
    MatTooltipModule,
    AgGridModule.withComponents([])
  ],
  providers: [httpInterceptorProviders]
})
export class AdminModule { }
