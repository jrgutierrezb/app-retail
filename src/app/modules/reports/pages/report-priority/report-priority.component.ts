import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-priority',
  templateUrl: './report-priority.component.html',
  styleUrls: ['./report-priority.component.scss']
})
export class ReportPriorityComponent implements OnInit {

  months = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];
  
  constructor() { }

  ngOnInit(): void {
  }

  chartBarData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 17, 42, 79]
      }
    ]
  };

  // chartBarOptions = {
  //   maintainAspectRatio: false,
  // };


}
