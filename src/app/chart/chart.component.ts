import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../movie';
import { PusherService } from '../pusher.service'
import { VoteResult } from './vote-result';
import { Poll } from '../poll';

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
  private _poll: Poll;
  currentMax: Movie;

  constructor(private pusherService: PusherService) { }

  @Input()
  set poll(poll: Poll){
    this._poll = poll;
    this.newData(poll.movies);
  }

  private newData(movies: Movie[]){
    this.barChartLabels = movies.map(x => x.title);
    var votesData = movies.map(x => x.votes);
    this.barChartData = [{ data: votesData }]
  }

  ngOnInit() {
    this.findMaxVoted();

    const channel = this.pusherService.init();
    channel.bind('new-vote', (data: VoteResult) => {
      if(data.pollId === this._poll._id){
        this._poll.movies = this._poll.movies.map(x => {
          if(x.id === data.movieId){
            x.votes++;
          } else if(data.oldMovieId && x.id === data.oldMovieId){
            x.votes--;
          }
          return x;
        });
      }
      this.poll = this._poll;
      this.findMaxVoted();
    });
  }

  findMaxVoted(): void {
    var max: Movie = this._poll.movies[0];
    for(var i = 0; i < this._poll.movies.length; i++){
      if(this._poll.movies[i].votes > max.votes){
        max = this._poll.movies[i];
      }
    }

    this.currentMax = max;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }

}
