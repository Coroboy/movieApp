import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cartelera',
  imports: [MovieCard, CommonModule],
  templateUrl: './cartelera.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Cartelera implements OnInit {
  cartelera: Result[] = []
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
    const title = 'Cartelera de Cine - movieApp';
    const description = 'Explora las últimas películas en cartelera. Detalles, tráilers y recomendaciones personalizadas.';
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
    // Load first 10 pages simultaneously
    const requests = [];
    for (let page = 1; page <= 10; page++) {
      requests.push(this.movieS.obtenerCartelera(page));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach(res => {
          const filteredResults = this.movieS.filterResults(res.results);
          this.cartelera = [...this.cartelera, ...filteredResults]
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

    // Group movies by first genre
    this.cartelera.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        const primaryGenre = movie.genre_ids[0];
        if (!genreMap.has(primaryGenre)) {
          genreMap.set(primaryGenre, []);
        }
        genreMap.get(primaryGenre)!.push(movie);
      }
    });

    // Convert to array and sort by genre name
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
