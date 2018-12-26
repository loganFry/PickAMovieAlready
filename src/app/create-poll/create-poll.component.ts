import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { MovieCollection } from '../movie-collection';
import { ActivatedRoute, Params } from '@angular/router';
import { Poll } from '../poll';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {

  searchMovies: Movie[];
  private searchTerms = new Subject<string>();
  private paramsSub : Subscription;
  poll: Poll;

  constructor(private movieService: MovieService, private route : ActivatedRoute) { }

  ngOnInit() {
    // initialize poll to dummy data
    this.poll = new Poll();

    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.movieService.searchMovies(term)),
    ).subscribe(collection => this.searchMovies = collection.results);

    this.paramsSub = this.route.params.subscribe(params => {
      // get details of poll
      this.movieService.getPoll(params['id']).subscribe(res => {
        this.poll = res.data as Poll;
      })
    })
  }

  ngOnDestroy(){
    this.paramsSub.unsubscribe();
  }

  addMovie(movie: Movie): void {
    // If the movie isn't already in the list, add it.
    if(!this.poll.movies.find(x => x.id === movie.id)){
      this.poll.movies.push(movie);
      movie.votes = 0;
      this.movieService.addMovie(this.poll._id, movie).subscribe(res => {
        if (res.status === 200){
          console.log('Successfully added movie to poll');
        }
      });
    }
    
    // Clear the search results.
    this.search("");
  }

  removeMovie(movie: Movie): void {
    this.poll.movies = this.poll.movies.filter(x => x.id !== movie.id);
    this.movieService.removeMovie(this.poll._id, movie.id).subscribe(res => {
      if(res.status === 200){
        console.log('Successfully removed movie from poll');
      }
    });
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

}
