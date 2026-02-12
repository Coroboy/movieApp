import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { CategoryMenu, Category } from '../../components/category-menu/category-menu';

@Component({
  selector: 'app-cartelera',
  imports: [MovieCard, CommonModule, HeroCarousel, CategoryMenu],
  templateUrl: './cartelera.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cartelera implements OnInit {
  cartelera: Result[] = []
  genreGroups: GenreGroup[] = []
  filteredMovies: Result[] = []
  categories: Category[] = []
  selectedCategoryId: number = 0

  movieS = inject(MovieService)
  meta = inject(Meta)
  titleService = inject(Title)
  cdr = inject(ChangeDetectorRef)
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
        this.categories = [
          { id: 0, name: 'Destacados' },
          ...this.genreGroups.map(g => ({ id: g.genreId, name: g.genreName }))
        ];
        this.filteredMovies = this.cartelera; // Show all movies for Destacados by default
        this.loading = false
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.log('Error', err)
        this.loading = false
      }
    })
  }

  organizarPorGeneros() {
    const genreMap = new Map<number, Result[]>();

    // Group movies by ALL their genres (not just the first one)
    this.cartelera.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        // Add movie to every genre it belongs to
        movie.genre_ids.forEach(genreId => {
          if (!genreMap.has(genreId)) {
            genreMap.set(genreId, []);
          }
          genreMap.get(genreId)!.push(movie);
        });
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

  onCategorySelected(genreId: number) {
    this.selectedCategoryId = genreId;
    if (genreId === 0) {
      // Show all movies mixed together for "Destacados"
      this.filteredMovies = this.cartelera;
    } else {
      // Show only movies from the selected genre
      const genreGroup = this.genreGroups.find(g => g.genreId === genreId);
      this.filteredMovies = genreGroup ? genreGroup.items : [];
    }
    this.cdr.markForCheck();
  }
}
