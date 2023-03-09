import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IHeaders } from '../../interfaces/headers';
import { IEventTable } from '../../interfaces/event-table';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor() {
    
   }

  @Input() hover: boolean = false;
  @Input() striped: boolean = false;

  @Input() headers!: IHeaders[];

  @Input() title!: IHeaders[];

  @Input() data!: any[];

  @Input() isPagination: boolean = false;

  @Input() eventsTable!: IEventTable[];

  @Output() emitEvent = new EventEmitter<any>();

  public items: any [] = [];
  public itemNumber: number = 10;
  public currentPage: number = 1;
  public pageNumber: number;
  public numberpages: any[];
  public paginator: number[] = [ 5, 10, 15, 20, 25];
  public range: number = 2;
  

  ngOnInit(): void {
  }

  public viewData() {
    if(this.isPagination && this.data) {
      this.currentPage = 1;
      this.pageNumber = Math.ceil(this.data.length / this.itemNumber);
      this.numberpages = [];
      this.items = this.data.slice(((this.currentPage * this.itemNumber) - this.itemNumber), ((this.currentPage * this.itemNumber)))
      console.log(this.items);
      for(let i = 0; i < this.pageNumber; i++) {
        if(i < 5)
          this.numberpages.push(i+1);
      }
    }
    else {
      this.items = this.data;
    }
  }

  change() {
    this.viewData();
  }

  getDate(item: any, field:string, type: string) {
    if(type == 'datetime') {
      return (new Date(item[field])).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
    }
    else {
      return (new Date(item[field])).toISOString().slice(0, 10).replace(/-/g, "/").replace("T", " ");
    }
    
  }

  emit(item: any, permiso:string) {
    let data = {
      item: item,
      permiso: permiso
    };
    console.log(item);
    this,this.emitEvent.emit(data);
  }

  reloadData() {
    setTimeout(() => {
      this.getNumberPages();
      console.log(this.numberpages);
      this.items = this.data.slice(((this.currentPage * this.itemNumber) - this.itemNumber), ((this.currentPage * this.itemNumber)))
      console.log(this.items);
    }, 100);
  }

  getNumberPages() {
    let tmpNumbers = [];
    for(let i = -this.range; i <= this.range; i++) {
      tmpNumbers.push(i);
    }
    this.numberpages = tmpNumbers.map(x => x + this.currentPage)
      .filter((page) => page > 0 && page <= this.pageNumber);
  }

  goToPage(page: any) {
    if(!Number.isFinite(page)) {
      return;
    }

    if(page == this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.reloadData();
  }

  nextPage() {
    if(this.currentPage == this.pageNumber) {
      return;
    }
    this.currentPage++;
    this.reloadData();
  }

  endPage(page: number) {
    if(this.currentPage == this.pageNumber) {
      return;
    }
    this.currentPage = page;
    this.reloadData();
  }

  previousPage() {
    if(this.currentPage == 1) {
      return;
    }
    this.currentPage--;
    this.reloadData();
  }

  startPage(page: number) {
    if(this.currentPage == 1) {
      return;
    }
    this.currentPage = page;
    this.reloadData();
  }

  

}
