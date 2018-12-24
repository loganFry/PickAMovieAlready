import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MovieCollection } from './movie-collection';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  //declare url of api
  private searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=b81172effc504f17715f4b15b0eb8d1d&language=en-US';
  private discoverUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=b81172effc504f17715f4b15b0eb8d1d&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1';
  //declare api key

  constructor(private http: HttpClient) { }

  getMovies(): Observable<MovieCollection> {
    return this.http.get<MovieCollection>(this.discoverUrl);
  }

  searchMovies(query: string): Observable<MovieCollection> {
    if (!query.trim()) {
      // if not search term, return empty hero array.
      var empty = new MovieCollection();
      return of(empty);
    }
    return this.http.get<MovieCollection>(`${this.searchUrl}&query=${query}&page=1&include_adult=false`)
  }
}
