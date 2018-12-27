import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { HomeComponent } from './home/home.component';
import { PollComponent } from './poll/poll.component';

const routes: Routes = [
  { path: 'create/:id', component: CreatePollComponent },
  { path: 'poll/:id', component: PollComponent },  
  { path: '', pathMatch: 'full', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
