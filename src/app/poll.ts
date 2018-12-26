import {Movie} from './movie';

export class Poll {
    _id: string;
    movies: Movie[];

    constructor(){
        this.movies = [];
        this._id = null;
    }
}