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
    // Increase the vote number for the movie
    this.poll.movies = this.poll.movies.map(x => {
      if(x.id === movie.id){
        x.votes++;
      }
      return x;
    });

    // Depending on whether or not the user has already voted,
    // decrease vote count from the previous vote
    if(this.currentVote){
      this.poll.movies = this.poll.movies.map(x => {
        if(x.id === this.currentVote.id){
          x.votes--;
        }
        return x;
      });
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
