import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-cartelera',
  imports: [MovieCard],
  templateUrl: './cartelera.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Cartelera {
  cartelera: Result[] = []
  movieS = inject(MovieService)

  constructor(){
    this.movieS.obtenerCartelera().subscribe(
      {
        next: (pelis) => {
          this.cartelera = pelis.results
        },
        error: (err) => console.log('Erro', err)
      }
    )
  }
}
