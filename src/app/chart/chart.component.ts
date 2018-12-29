import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true // start y axis at 0
        }
      }]
    }
  };
  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = false;
  public chartColors: Array<any> = [
    {
      backgroundColor: '#15bfde' // same as $primary-blue in styles.scss
    }
  ];
  public barChartData:any[] = [];

  constructor() { }

  @Input()
  set movies(movies: Movie[]){
    this.barChartLabels = movies.map(x => x.title);
    var votesData = movies.map(x => x.votes);
    this.barChartData = [{ data: votesData }]
  }

  ngOnInit() {
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }

}
