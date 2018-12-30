import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { Poll } from '../poll';
import { Movie } from '../movie';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  private paramsSub: Subscription;
  poll: Poll;
  currentVote: Movie;

  constructor(private movieService: MovieService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentVote = null;

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

  

  voteForMovie(movie: Movie){
    if(this.currentVote){
      this.movieService.voteForMovie(this.poll._id, movie.id, this.currentVote.id).subscribe(res => {
        if(res.status === 200){
          console.log("Successfully voted and removed old vote")
        }
      });
    } else {
      this.movieService.voteForMovie(this.poll._id, movie.id).subscribe(res => {
        if(res.status === 200){
          console.log("Successfully voted for first movie")
        }
      });
    }

    // Update the current vote
    this.currentVote = movie;
  }

}
