import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IProcessState } from 'src/app/modules/assetsManagement/interfaces/IProcessState';
import { ProcessStateService } from 'src/app/modules/assetsManagement/services/process-state.service';
import { ReportsService } from '../../services/reports-services';


@Component({
  selector: 'app-report-state',
  templateUrl: './report-state.component.html',
  styleUrls: ['./report-state.component.scss']
})
export class ReportStateComponent implements OnInit {

  state = [];
  data = [];
  valor = [];
  public processStates: IProcessState[];

  formSearch!: FormGroup;

  mounths =[ {
    "id": "1",
    "name": "January"
  },
  {
    "id": "2",
    "name": "February"
  },
  {
    "id": "3",
    "name": "March"
  },
  {
    "id": "4",
    "name": "April"
  },
  {
    "id": "5",
    "name": "May"
  },
  {
    "id": "6",
    "name": "June"
  },
  {
    "id": "7",
    "name": "July"
  },
  {
    "id": "8",
    "name": "August"
  },
  {
    "id": "9",
    "name": "September"
  },
  {
    "id": "10",
    "name": "October"
  },
  {
    "id": "11",
    "name": "November"
  },
  {
    "id": "12",
    "name": "December"
  }];
  
  years = []
  anioActual = new Date().getFullYear();
  dataIsEmpty: boolean;

  constructor(
    private reportsService: ReportsService ) { 
      this.formSearch = new FormGroup({
        mounthId: new FormControl(null),
        yearId: new FormControl(null)
      });
    }

  ngOnInit(): void {
    this.rangeYear(); 
    this.search();
    this.chartPieOptions.aspectRatio = 500 / 500;
  }

  search(){
    let params = {
      "p_month": this.formSearch.get('mounthId').value ? Number.parseInt(this.formSearch.get('mounthId').value)  : null,
      "p_year":  this.formSearch.get('yearId').value ? Number.parseInt(this.formSearch.get('yearId').value)  : this.anioActual
    }; 
    this.reportsService.ReportStates(params).subscribe(
      (respuesta) => {
          this.data = respuesta.data;
          if(this.data.length > 0){
            this.dataIsEmpty = true;
            this.state = [];
            this.valor = [];
            this.data.forEach(element => {
              this.state.push(element.name);
              this.valor.push(element.quantity);
            });
            this.updateCart();
          }
          else{
            this.dataIsEmpty = false;
          }
          
        });
  }

  rangeYear () {
    const max = new Date().getFullYear();
    const min = max - 10;
  
    for (let i = max; i >= min; i--) {
        this.years.push(i)
    }
    return this.years
  }

  updateCart(){
    this.chartPieData = {
      labels: this.state,
      datasets: [
        {
          data: this.valor,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#41B883', '#E46651', '#00D8FF', '#DD1B16','#808080'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#41B883', '#E46651', '#00D8FF', '#DD1B16', '#808080']
        }
      ]
    };
  }

  chartPieData = {
    labels: this.state,
    datasets: [
      {
        data: this.valor,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#41B883', '#E46651', '#00D8FF', '#DD1B16','#808080'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#41B883', '#E46651', '#00D8FF', '#DD1B16', '#808080']
      }
    ]
  };

   chartPieOptions = {
    aspectRatio: 1,
    responsive: true,
    maintainAspectRatio: false,
    radius: '100%',
  };

}

