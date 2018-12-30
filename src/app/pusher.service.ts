import { Injectable } from '@angular/core';
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;

  constructor() {
    this.pusher = new Pusher('21edfa48d7919be4ec20', {
      cluster: 'us2'
    });
    this.channel = this.pusher.subscribe('polls');
  }

  public init() {
    return this.channel;
  }
}