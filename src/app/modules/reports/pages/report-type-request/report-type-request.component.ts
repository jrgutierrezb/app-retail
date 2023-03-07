import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../services/reports-services';

@Component({
  selector: 'app-report-type-request',
  templateUrl: './report-type-request.component.html',
  styleUrls: ['./report-type-request.component.scss']
})
export class ReportTypeRequestComponent implements OnInit {

  months = [];
  // months = ['January', 'February', 'March', 'April', 'May', 'June', 
  // 'July', 'August', 'September', 'October', 'November', 'December'];

  years =[];
  anioActual = new Date().getFullYear();

  formSearch!: FormGroup;
  anio: number;
  data = [];
  valor: any;
  mantenimiento = [];
  requerimiento = [];
  dataIsEmpty: boolean = false;

  constructor(
    private reportsService: ReportsService,
  ) { 
    this.formSearch = new FormGroup({
      yearId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.rangeYear();
    this.changeYears();
  }

  changeYears(){
    this.anio =  this.formSearch.get('yearId').value ? Number.parseInt(this.formSearch.get('yearId').value)  : this.anioActual;
    this.reportsService.ReportTypesRequests(this.anio).subscribe(
      (respuesta) => {
          this.data = respuesta.data;
          if(this.data.length > 0){
            this.dataIsEmpty = true;
            this.months = [];
            this.mantenimiento = [];
            this.requerimiento = [];
            this.data.forEach(element => {
              this.months.push(element.mes_desc);
              this.mantenimiento.push(element.mantenimiento);
              this.requerimiento.push(element.requerimiento);
            });
            this.updateCart();
          }else{
            this.dataIsEmpty = false;
          }
            
        });  
  }

  updateCart(){
    this.chartLineData = {
      labels: this.months,
      datasets: [
        {
          label: 'Mantenimiento',
          backgroundColor: 'rgba(220, 220, 220, 0.2)',
          borderColor: 'rgba(220, 220, 220, 1)',
          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
          pointBorderColor: '#fff',
          data: this.mantenimiento
        },
        {
          label: 'Requerimiento',
          backgroundColor: 'rgba(151, 187, 205, 0.2)',
          borderColor: 'rgba(151, 187, 205, 1)',
          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
          pointBorderColor: '#fff',
          data: this.requerimiento
        }
      ]
    };
  }

   chartLineData = {
    labels: this.months,
    datasets: [
      {
        label: 'Mantenimiento',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: this.mantenimiento
      },
      {
        label: 'Requerimiento',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: this.requerimiento
      }
    ]
  };

  chartLineOptions = {
    maintainAspectRatio: false,
  };

  rangeYear () {
    const max = new Date().getFullYear();
    const min = max - 10;
  
    for (let i: number = max; i >= min; i--) {
        this.years.push(i)
    }
    return this.years
  }


}
