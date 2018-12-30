import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;

  constructor() {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster
    });
    this.channel = this.pusher.subscribe('polls');
  }

  public init() {
    return this.channel;
  }
}