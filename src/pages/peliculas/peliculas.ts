import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-peliculas',
  imports: [MovieCard, CommonModule, HeroCarousel, CategoryMenu],
  templateUrl: './peliculas.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Peliculas implements OnInit {
  activeRoute = inject(ActivatedRoute)
  peliculas: Result[] = []
  genreGroups: GenreGroup[] = []
  filteredMovies: Result[] = []
  categories: Category[] = []
  selectedCategoryId: number = 0
  get selectedCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategoryId);
    return category ? category.name : '';
  }

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

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
    const title = 'Películas - movieApp';
    const description = 'Explora las mejores películas, estrenos y clásicos en cartelera. Detalles, tráilers y recomendaciones personalizadas.';
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  cargarTodasLasPaginas() {
    this.loading = true
    const requests = [];
    // Load first 10 pages for both categories
    for (let page = 1; page <= 10; page++) {
      requests.push(this.movieS.obtenerCartelera(page));
      requests.push(this.movieS.obtenerEstrenos(page));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        const allResults: Result[] = [];
        responses.forEach(res => {
          const filteredResults = this.movieS.filterResults(res.results);
          allResults.push(...filteredResults);
        });

        // Remove duplicates based on ID
        const uniqueMap = new Map<number, Result>();
        allResults.forEach(movie => {
          if (!uniqueMap.has(movie.id)) {
            uniqueMap.set(movie.id, movie);
          }
        });

        this.peliculas = Array.from(uniqueMap.values());

        // Sort by popularity and rating (consistent with search)
        this.peliculas.sort((a, b) => {
          const scoreA = (a.popularity || 0) + (a.vote_average || 0) * 10;
          const scoreB = (b.popularity || 0) + (b.vote_average || 0) * 10;
          return scoreB - scoreA;
        });

        this.organizarPorGeneros()
        this.categories = [
          { id: 0, name: 'Destacados' },
          ...this.genreGroups.map(g => ({ id: g.genreId, name: g.genreName }))
        ];

        // Check for genreId in query parameters
        const genreIdParam = this.activeRoute.snapshot.queryParamMap.get('genreId');
        if (genreIdParam) {
          const genreId = parseInt(genreIdParam, 10);
          this.onCategorySelected(genreId);
        } else {
          this.filteredMovies = this.peliculas;
        }

        this.loading = false
        this.cdr.markForCheck()
      },
      error: (err: any) => {
        console.log('Error', err)
        this.loading = false
      }
    })
  }

  organizarPorGeneros() {
    const genreMap = new Map<number, Result[]>();

    this.peliculas.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        movie.genre_ids.forEach(genreId => {
          if (!genreMap.has(genreId)) {
            genreMap.set(genreId, []);
          }
          genreMap.get(genreId)!.push(movie);
        });
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

  onCategorySelected(genreId: number) {
    this.selectedCategoryId = genreId;
    if (genreId === 0) {
      this.filteredMovies = this.peliculas;
    } else {
      const genreGroup = this.genreGroups.find(g => g.genreId === genreId);
      this.filteredMovies = genreGroup ? genreGroup.items : [];
    }

    this.cdr.markForCheck();
  }
}
