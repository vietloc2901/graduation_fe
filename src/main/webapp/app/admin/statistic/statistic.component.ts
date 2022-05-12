import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Path } from '@progress/kendo-drawing';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { MatDialog } from '@angular/material/dialog';
import '@progress/kendo-angular-intl/locales/de/all';
import { OrderService } from 'app/core/service/order.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'jhi-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'vn'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class StatisticComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('dp') dp : MatDatepicker<null>;

  
  maps : any = [];
  
  dateSearch;
  maxDate;
  hide = true;

  done
  waiting
  preparing
  transfering
  cancel
  total

  revenueChart;
  quantityChart;
  
  
  //=======Data for kendo chart=========
  

  dataForSearch ={
    monthForStatistic: null,
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private matDialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private orderService: OrderService
  ) { 
  }

  ngAfterViewInit(){
    // setTimeout(() => {
    // console.log(this.chart.surface);
    // this.chart.surface.bind('mouseenter', this.handleMouseEnter);
    // this.chart.surface.bind('mouseleave', this.handleMouseLeave);
    // this.changeDetectorRef.detectChanges();
    // }, 1000);
  }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.dateSearch = this.maxDate.getFullYear().toString() + '-';
    if(this.maxDate.getMonth() + 1 < 10){
      this.dateSearch += ('0' + (this.maxDate.getMonth() + 1).toString());
    }else{
      this.dateSearch += (this.maxDate.getMonth() + 1).toString();
    }
    this.dataForSearch.monthForStatistic = this.dateSearch;
    this.search();
  }

  ngOnDestroy(){
  }


  openPopup(){
    console.log(this.dp)
    this.dp.open();
  }


  searchData(){

  }

  date = new FormControl(moment());

  format(nbStr){
    if(nbStr.length > 7){
      return nbStr.substring(0,7)+'...';
    }else{
      return nbStr;
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  search(){
    this.hide = false;
    console.log(this.dataForSearch.monthForStatistic)
    let data = {
      monthForStatistic: this.dataForSearch.monthForStatistic
    }
    this.orderService.statistic(data).subscribe((res)  => {
      this.total = res.totalOrders;
      this.done = res.totalDoneOrders;
      this.waiting = res.totalWaitingOrders;
      this.cancel = res.totalCancelOrders;
      this.preparing = res.totalPreparingOrders;
      this.transfering = res.totalTransferOrders;
      this.revenueChart = res.revenuePerProducts.map((item) => {
        return {
          name: item.name,
          value: item.valueRevenue
        }
      });
      this.quantityChart = res.quantityPerProducts.map(item => {
        return {
          name: item.name,
          value: item.valueQuantity
        }
      });;
    })
  }


  seriesHover(e){
    console.log(e);
  }

  
  
  margin(e){
    console.log(e);
    if(e.length <= 10){
      return -95;
    }else{
      return -95 - (5 * (e.length - 10));
    }
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const codeA = a.code.toUpperCase();
    const codeB = b.code.toUpperCase();
  
    let comparison = 0;
    if (codeA > codeB) {
      comparison = 1;
    } else if (codeA < codeB) {
      comparison = -1;
    }
    return comparison;
  }

  formatMoney(value) {
    value = Math.round(value);
    var newValue = value;
    if (value >= 1000000000000) {
        return Math.round(value / 1000000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'T';
    }
    if(value >= 10000000000){
      return Math.round(value / 1000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'B';
    }
    if(value >= 10000000){
      return Math.round(value / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'M';
    }
    if(value >= 10000){
      return Math.round(value / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'K';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  onClosed(e){
    let year = new Date(this.date.value._d).getFullYear();
    let month = new Date(this.date.value._d).getMonth() + 1;
    if(month < 10){
      this.dataForSearch.monthForStatistic = year.toString() + '-' + '0' + month.toString();
    }else{
      this.dataForSearch.monthForStatistic = year.toString() + '-' + month.toString();
    }
    this.search()
  }

  content1 = (e) => {
    // console.log(e);
    if(e.value.length >= 9){
      return e.value.substring(0,7) + '...';
    }else{
      return e.value;
    }
  }

saleData = [
  { name: "Mobiles", value: 105000 },
  { name: "Laptop", value: 55000 },
  { name: "AC", value: 15000 },
  { name: "Headset", value: 150000 },
  { name: "Fridge", value: 20000 }
];

}

