import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GENRE_MAP, GenreGroup } from '../../app/constants/genres';
import { forkJoin } from 'rxjs';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { CategoryMenu, Category } from '../../components/category-menu/category-menu';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-series',
  imports: [MovieCard, CommonModule, HeroCarousel, CategoryMenu],
  templateUrl: './series.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Series implements OnInit {
  activeRoute = inject(ActivatedRoute);
  movieService = inject(MovieService);
  series: Result[] = [];
  genreGroups: GenreGroup[] = []
  filteredMovies: Result[] = []
  categories: Category[] = []
  selectedCategoryId: number = 0
  get selectedCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategoryId);
    return category ? category.name : '';
  }

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  loading = false
  meta = inject(Meta)
  titleService = inject(Title)
  cdr = inject(ChangeDetectorRef)

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
          this.filteredMovies = this.series;
        }

        this.loading = false
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    });
  }

  organizarPorGeneros() {
    const genreMap = new Map<number, Result[]>();

    // Group series by ALL their genres (not just the first one)
    this.series.forEach(serie => {
      if (serie.genre_ids && serie.genre_ids.length > 0) {
        // Add series to every genre it belongs to
        serie.genre_ids.forEach(genreId => {
          if (!genreMap.has(genreId)) {
            genreMap.set(genreId, []);
          }
          genreMap.get(genreId)!.push(serie);
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
      // Show all series mixed together for "Destacados"
      this.filteredMovies = this.series;
    } else {
      // Show only series from the selected genre
      const genreGroup = this.genreGroups.find(g => g.genreId === genreId);
      this.filteredMovies = genreGroup ? genreGroup.items : [];
    }

    // Scroll to top/left of the carousel
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollLeft = 0;
    }

    this.cdr.markForCheck();
  }
}
