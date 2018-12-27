import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { Poll } from '../poll';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  private paramsSub: Subscription;
  poll: Poll;

  constructor(private movieService: MovieService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.movieService.getPoll(params['id']).subscribe(res => {
        this.poll = res.data as Poll;
        console.log("Retrieved poll from db:");
        console.log(this.poll);
      });
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
