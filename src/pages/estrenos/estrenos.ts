import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';

@Component({
  selector: 'app-estrenos',
  imports: [MovieCard, CommonModule, HeroCarousel],
  templateUrl: './estrenos.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Estrenos implements OnInit {
  estrenos: Result[] = []
  genreGroups: GenreGroup[] = []
  movieS = inject(MovieService)
  meta = inject(Meta)
  titleService = inject(Title)
  loading = false

  ngOnInit() {
    this.updateMetaTags();
    this.cargarTodasLasPaginas();
  }

  updateMetaTags() {
    const title = 'Próximos Estrenos - movieApp';
    const description = 'Descubre las películas que llegarán pronto a la gran pantalla. Mantente al día con los mejores estrenos.';
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  constructor() {
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
          const filteredResults = this.movieS.filterResults(res.results);
          this.estrenos = [...this.estrenos, ...filteredResults]
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
