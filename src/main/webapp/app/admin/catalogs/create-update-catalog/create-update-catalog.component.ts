import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-create-update-catalog',
  templateUrl: './create-update-catalog.component.html',
  styleUrls: ['./create-update-catalog.component.scss']
})
export class CreateUpdateCatalogComponent implements OnInit {

  isCreateNew : boolean;
  listCatalogs = [];

  code = {
    value : null,
    error : null,
    message : ''
  }

  name = {
    value : null,
    error : null,
    message : ''
  }

  parentId = {
    value : null,
    error : null,
    message : ''
  }

  constructor() { }

  ngOnInit(): void {
  }

}
