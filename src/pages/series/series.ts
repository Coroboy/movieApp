import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';

@Component({
  selector: 'app-series',
  imports: [MovieCard, CommonModule, HeroCarousel],
  templateUrl: './series.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Series implements OnInit {
  movieService = inject(MovieService);
  series: Result[] = [];
  genreGroups: GenreGroup[] = []
  loading = false
  meta = inject(Meta)
  titleService = inject(Title)

  ngOnInit() {
    this.updateMetaTags();
    this.cargarTodasLasPaginas();
  }

  updateMetaTags() {
    const title = 'Series de TV - movieApp';
    const description = 'Explora las mejores series de televisión. Temporadas, episodios y recomendaciones personalizadas.';
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
      requests.push(this.movieService.obtenerSeriesTopRated(page));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach(res => {
          const filteredResults = this.movieService.filterResults(res.results);
          this.series = [...this.series, ...filteredResults]
        })
        this.organizarPorGeneros()
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    });
  }

  organizarPorGeneros() {
    const genreMap = new Map<number, Result[]>();

    this.series.forEach(serie => {
      if (serie.genre_ids && serie.genre_ids.length > 0) {
        const primaryGenre = serie.genre_ids[0];
        if (!genreMap.has(primaryGenre)) {
          genreMap.set(primaryGenre, []);
        }
        genreMap.get(primaryGenre)!.push(serie);
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
