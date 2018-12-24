import { Movie } from "./movie";

export class MovieCollection {
    page: number;
    total_results: number;
    total_pages: number;
    results: Movie[];
}