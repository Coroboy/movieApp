import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-estrenos',
  imports: [MovieCard],
  templateUrl: './estrenos.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Estrenos {
  estrenos: Result[] = []
  movieS = inject(MovieService)

  constructor(){
    this.movieS.obtenerEstrenos().subscribe(
      {
        next: (pelis) => {
          this.estrenos = pelis.results
        },
        error: (err) => console.log('Erro', err)
      }
    )
  }
 }
