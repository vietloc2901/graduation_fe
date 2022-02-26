import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CatalogService } from '../../core/service/catalog.service';
import {NO_ROW_GRID_TEMPLATE} from '../../app.constants';

@Component({
  selector: 'jhi-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent implements OnInit {

  noRowTemplate = NO_ROW_GRID_TEMPLATE;

  constructor(
    private catalogService : CatalogService,
    public http: HttpClient,
    private toatr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

}
