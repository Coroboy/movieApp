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
  selector: 'app-anime',
  imports: [MovieCard, CommonModule, HeroCarousel, CategoryMenu],
  templateUrl: './anime.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Anime implements OnInit {
  activeRoute = inject(ActivatedRoute)
  animeItems: Result[] = []
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
    this.cargarAnime();
  }

  updateMetaTags() {
    const title = 'Anime - movieApp';
    const description = 'Encuentra las mejores películas y series de Anime japonés en un solo lugar. Colección exclusiva de animación japonesa.';
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  cargarAnime() {
    this.loading = true
    const requests = [];

    // Load Movies and Series
    for (let page = 1; page <= 10; page++) {
      requests.push(this.movieS.obtenerCartelera(page));
      requests.push(this.movieS.obtenerEstrenos(page));
      requests.push(this.movieS.obtenerSeriesTopRated(page));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        const allAnimeResults: Result[] = [];
        responses.forEach(res => {
          const onlyAnime = this.movieS.filterOnlyAnime(res.results);
          allAnimeResults.push(...onlyAnime);
        });

        // Remove duplicates
        const uniqueMap = new Map<number, Result>();
        allAnimeResults.forEach(item => {
          if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
          }
        });

        this.animeItems = Array.from(uniqueMap.values());

        // Sort by popularity
        this.animeItems.sort((a, b) => {
          const scoreA = (a.popularity || 0) + (a.vote_average || 0) * 10;
          const scoreB = (b.popularity || 0) + (b.vote_average || 0) * 10;
          return scoreB - scoreA;
        });

        this.organizarPorGeneros()
        this.categories = [
          { id: 0, name: 'Animes Destacados' },
          ...this.genreGroups.map(g => ({ id: g.genreId, name: g.genreName }))
        ];

        // Check for genreId in query parameters
        const genreIdParam = this.activeRoute.snapshot.queryParamMap.get('genreId');
        if (genreIdParam) {
          const genreId = parseInt(genreIdParam, 10);
          this.onCategorySelected(genreId);
        } else {
          this.filteredMovies = this.animeItems;
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

    this.animeItems.forEach(item => {
      if (item.genre_ids && item.genre_ids.length > 0) {
        item.genre_ids.forEach(genreId => {
          if (!genreMap.has(genreId)) {
            genreMap.set(genreId, []);
          }
          genreMap.get(genreId)!.push(item);
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
      this.filteredMovies = this.animeItems;
      this.cdr.markForCheck();
    } else {
      // First show what we have locally
      const genreGroup = this.genreGroups.find(g => g.genreId === genreId);
      this.filteredMovies = genreGroup ? genreGroup.items : [];
      this.cdr.markForCheck();

      // Then fetch more results specifically for this genre (both movies and series)
      // and filter for Anime (Animation + Japanese)
      this.loading = true;
      const movieReq = this.movieS.getByGenre('movie', genreId);
      const seriesReq = this.movieS.getByGenre('tv', genreId);

      forkJoin([movieReq, seriesReq]).subscribe({
        next: ([movieRes, seriesRes]) => {
          const combined = [...movieRes.results, ...seriesRes.results];
          const onlyAnime = this.movieS.filterOnlyAnime(combined);

          // Merge with current filtered items and remove duplicates
          const uniqueMap = new Map<number, Result>();
          [...this.filteredMovies, ...onlyAnime].forEach(item => {
            if (!uniqueMap.has(item.id)) {
              uniqueMap.set(item.id, item);
            }
          });

          this.filteredMovies = Array.from(uniqueMap.values());
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching more animes by genre', err);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
