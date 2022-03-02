import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'jhi-action-catalog',
  templateUrl: './action-catalog.component.html',
  styleUrls: ['./action-catalog.component.scss']
})
export class ActionCatalogComponent implements OnInit, ICellRendererAngularComp {

  rowIndex;
  cellValue: string;
 
  ngOnInit(): void {
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    return true
  }

}
