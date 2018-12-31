import { Movie } from "../movie";

export class AddMovieEvent {
    pollId: string;
    movie: Movie;
}