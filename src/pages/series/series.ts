import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-series',
  imports: [MovieCard],
  templateUrl: './series.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Series {
  movieService = inject(MovieService);
  series: Result[] = [];

  constructor() {
    this.movieService.obtenerSeriesTopRated().subscribe({
      next: (res) => {
        this.series = res.results;
      },
      error: (err) => console.log(err)
    });
  }
}
