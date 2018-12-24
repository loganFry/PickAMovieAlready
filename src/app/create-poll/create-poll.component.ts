import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { MovieCollection } from '../movie-collection';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {

  movies: Movie[];
  searchMovies: Movie[];
  private searchTerms = new Subject<string>();

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.getMovies();
    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.movieService.searchMovies(term)),
    ).subscribe(collection => this.searchMovies = collection.results);
  }

  getMovies(): void {
    this.movieService.getMovies().subscribe(movies => this.movies = movies.results.slice(0, 6))
  }

  addMovie(movie: Movie): void {
    // If the movie isn't already in the list, add it.
    if(!this.movies.find(x => x.id === movie.id)){
      this.movies.push(movie);
    }
    
    // Clear the search results.
    this.search("");
  }

  removeMovie(movie: Movie): void {
    this.movies = this.movies.filter(x => x.id !== movie.id);
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

}
