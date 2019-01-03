import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Poll } from '../poll';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { PusherService } from '../pusher.service';
import { AddMovieEvent } from './add-movie-event';
import { RemoveMovieEvent } from './remove-movie-event';

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
  voteUrl: string;
  createUrl: string;
  closeResult: string;

  constructor(
    private movieService: MovieService, 
    private route: ActivatedRoute, 
    private modalService: NgbModal,
    private pusherService: PusherService) { }

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
    ).subscribe(collection => {
      this.searchMovies = collection.results;
    });

    this.paramsSub = this.route.params.subscribe(params => {
      // get details of poll
      this.movieService.getPoll(params['id']).subscribe(res => {
        this.poll = res.data as Poll;
        this.voteUrl = `${environment.client.baseUrl}/poll/${this.poll._id}`;
        this.createUrl = `${environment.client.baseUrl}/create/${this.poll._id}`;
        console.log("Retrieved poll from db:");
        console.log(this.poll);
      });
    });

    const channel = this.pusherService.init();

    // Listen for the add movie event
    channel.bind('add-movie', (data: AddMovieEvent) => {
      if(data.pollId === this.poll._id){
        this.poll.movies.push(data.movie);
      }
    });

    // Listen for the remove movie event
    channel.bind('remove-movie', (data: RemoveMovieEvent) => {
      if(data.pollId === this.poll._id){
        this.poll.movies = this.poll.movies.filter(x => x.id !== data.movieId);
      }
    });
  }

  ngOnDestroy(){
    this.paramsSub.unsubscribe();
  }

  addMovie(movie: Movie): void {
    // If the movie isn't already in the list, add it.
    if(!this.poll.movies.find(x => x.id === movie.id)){
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

  copyToClipboard(message: string): boolean {
    let result, textArea;

    try {
      // Create a temporary textarea to copy from
      textArea = document.createElement('textarea');
      // readonly to stop keyboard popping up
      textArea.setAttribute('readonly', 'true'); 
      // contenteditable to allow copying on iOS
      textArea.setAttribute('contenteditable', 'true');
      // position fixed to prevent page from scrolling to new element when focus is set
      textArea.style.position = 'fixed';
      textArea.style.left = '0';
      textArea.style.top = '0';
      textArea.style.opacity = '0';

      // set temp element text to the text to be copied
      textArea.value = message;

      // add the temp element to the document
      document.body.appendChild(textArea);

      // select and focus the temp element
      textArea.focus();
      textArea.select();

      // select the contents of the temp element
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      textArea.setSelectionRange(0, textArea.value.length);

      // copy the text
      result = document.execCommand('copy');
    } catch(err) {
      console.error(err);
      result = null;
    } finally {
      // remove the temp element
      document.body.removeChild(textArea);
    }
    
    return result;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

}
