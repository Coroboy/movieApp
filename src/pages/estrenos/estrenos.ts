import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-estrenos',
  imports: [MovieCard, CommonModule],
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
  genreGroups: GenreGroup[] = []
  movieS = inject(MovieService)
  loading = false

  constructor() {
    this.cargarTodasLasPaginas()
  }

  cargarTodasLasPaginas() {
    this.loading = true
    const requests = [];
    for (let page = 1; page <= 10; page++) {
      requests.push(this.movieS.obtenerEstrenos(page));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach(res => {
          this.estrenos = [...this.estrenos, ...res.results]
        })
        this.organizarPorGeneros()
        this.loading = false
      },
      error: (err) => {
        console.log('Error', err)
        this.loading = false
      }
    })
  }

  organizarPorGeneros() {
    const genreMap = new Map<number, Result[]>();

    this.estrenos.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        const primaryGenre = movie.genre_ids[0];
        if (!genreMap.has(primaryGenre)) {
          genreMap.set(primaryGenre, []);
        }
        genreMap.get(primaryGenre)!.push(movie);
      }
    });

    this.genreGroups = Array.from(genreMap.entries())
      .map(([genreId, items]) => ({
        genreId,
        genreName: GENRE_MAP[genreId] || 'Otros',
        items
      }))
      .filter(group => group.items.length > 0)
      .sort((a, b) => a.genreName.localeCompare(b.genreName));
  }
}
