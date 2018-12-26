import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MovieCollection } from './movie-collection';
import { ApiResponse } from './api-response';
import { Poll } from './poll';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiKey = 'b81172effc504f17715f4b15b0eb8d1d'
  private searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US`
  private discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`


  private pollApiBase = `http://localhost:3000/api/polls`

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

  createPoll() : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.pollApiBase, {"movies": []});
  }

  getPoll(id: string) : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.pollApiBase}/${id}`);
  }

  addMovie(id: string, movie: Movie) : Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.pollApiBase}/${id}/addMovie`, movie);
  }

  removeMovie(pollId: string, movieId: number) : Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.pollApiBase}/${pollId}/removeMovie`, {"movieId": movieId});
  }
}
