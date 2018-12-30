import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Poll } from '../poll';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  buttonClicked: boolean;
  apiMessage: string;

  constructor(private movieService : MovieService, private router : Router) { }

  ngOnInit() {
  }

  createPoll() : void {
    this.buttonClicked = true;
    this.movieService.createPoll().subscribe(
      res => {
        let poll = res.data as Poll;
        this.apiMessage = 'api returned with status ' + res.status;
        this.router.navigate(['/create', poll._id]);
      }
    );
  }

}
