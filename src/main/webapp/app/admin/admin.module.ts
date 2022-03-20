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
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductsComponent } from './products/products.component';
import { CreatUpdateProductComponent } from './products/creat-update-product/creat-update-product.component';
import { RouterModule } from '@angular/router';
import { PanelBarModule, TabStripModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormFieldModule, InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { UploadModule, UploadService } from '@progress/kendo-angular-upload';
import { BodyModule, ColumnResizingService, FilterMenuModule, GridModule, PagerModule, SharedModule } from '@progress/kendo-angular-grid';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ActionProductComponent } from './products/action-product/action-product.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    CatalogsComponent,
    OrdersComponent,
    ActionCatalogComponent,
    CreateUpdateCatalogComponent,
    ProductsComponent,
    CreatUpdateProductComponent,
    ActionProductComponent,
  ],
  imports: [
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzTreeSelectModule,
    CommonModule,
    NgSelectModule,
    MatTooltipModule,
    ModalModule,
    AgGridModule.withComponents([]),
    RouterModule,
    PanelBarModule,
    TabStripModule,
    ButtonsModule,
    DialogModule,
    DropDownListModule,
    DropDownsModule,
    FormFieldModule,
    InputsModule,
    TextBoxModule,
    LabelModule,
    DateInputsModule,
    BodyModule,
    FilterMenuModule,
    GridModule,
    PagerModule,
    SharedModule,
    EditorModule,
    UploadModule,
  ],
  entryComponents: [CreateUpdateCatalogComponent],
  providers: [httpInterceptorProviders, UploadService],
})
export class AdminModule {}
