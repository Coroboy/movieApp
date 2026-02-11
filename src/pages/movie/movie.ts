
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MovieService } from '../../app/services/movieService';
import { Result, MovieDetail } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { CurrencyPipe, DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { FavoritesService } from '../../app/services/favorites.service';
import { LikesService, LikeStatus } from '../../app/services/likes.service';
import { MoviePlayer } from '../../components/movie-player/movie-player';

@Component({
  selector: 'app-movie',
  imports: [MovieCard, CurrencyPipe, DatePipe, DecimalPipe, CommonModule, MoviePlayer],
  templateUrl: './movie.html',
  styles: `
    :host {
  display: block;
}
`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Movie {
  activeRoute = inject(ActivatedRoute)
  movieS = inject(MovieService)
  favoritesService = inject(FavoritesService)
  likesService = inject(LikesService)
  sanitizer = inject(DomSanitizer)
  meta = inject(Meta)
  titleService = inject(Title)
  movieId: string = ''
  movie!: MovieDetail
  recommendations: Result[] = []
  trailerKey: string | null = null
  showTrailer = false
  showAllRecommendations = false

  constructor() {
    this.activeRoute.params.subscribe(params => {
      this.movieId = params['id'];
      this.obtenerMovie();
    })
  }

  get isFavorite(): boolean {
    return this.movie ? this.favoritesService.isFavorite(this.movie.id) : false;
  }

  get likeStatus(): LikeStatus {
    return this.movie ? this.likesService.getLikeStatus(this.movie.id) : null;
  }

  get trailerUrl(): SafeResourceUrl | null {
    if (this.trailerKey) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.trailerKey}?autoplay=1`
      );
    }
    return null;
  }

  toggleFavorite() {
    if (this.movie) {
      const result: Result = {
        id: this.movie.id,
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        vote_average: this.movie.vote_average,
        release_date: this.movie.release_date,
        overview: this.movie.overview,
        adult: this.movie.adult,
        backdrop_path: this.movie.backdrop_path,
        genre_ids: this.movie.genres.map(g => g.id),
        original_language: this.movie.original_language,
        original_title: this.movie.original_title,
        popularity: this.movie.popularity,
        video: this.movie.video,
        vote_count: this.movie.vote_count,
        media_type: 'movie'
      };
      this.favoritesService.toggleFavorite(result);
    }
  }

  toggleLike() {
    if (this.movie) {
      this.likesService.toggleLike(this.movie.id, 'movie');
    }
  }

  toggleDislike() {
    if (this.movie) {
      this.likesService.toggleDislike(this.movie.id, 'movie');
    }
  }

  obtenerMovie() {
    this.movieS.obtenerMovie(this.movieId).subscribe({
      next: (movie) => {
        console.log(movie);
        this.movie = movie;
        this.updateMetaTags();
        this.obtenerRecomendaciones(this.movieId);
        this.loadTrailer();
      },
      error: (err) => console.log('Error', err)
    })
  }

  updateMetaTags() {
    if (!this.movie) return;

    const year = new Date(this.movie.release_date).getFullYear();
    const title = `${this.movie.title} (${year}) - movieApp`;
    const description = this.movie.overview
      ? this.movie.overview.substring(0, 200) + (this.movie.overview.length > 200 ? '...' : '')
      : `Mira ${this.movie.title} en movieApp. Descubre detalles, tráiler y recomendaciones.`;

    // Use w1280 instead of original to ensure image is < 5MB for social cards
    const image = this.movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path}`
      : `https://image.tmdb.org/t/p/w780${this.movie.poster_path}`;

    const url = window.location.href;

    // Update Browser Title
    this.titleService.setTitle(title);

    // Standard Meta Tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: `${this.movie.title}, película, ${year}, cine, streaming, trailer, movieApp` });
    this.meta.updateTag({ name: 'author', content: 'movieApp' });

    // Open Graph Tags (Facebook, WhatsApp, LinkedIn)
    this.meta.updateTag({ property: 'og:site_name', content: 'movieApp' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1280' });
    this.meta.updateTag({ property: 'og:image:height', content: '720' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'video.movie' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: `Poster de ${this.movie.title}` });
  }

  loadTrailer() {
    this.movieS.getMovieVideos(this.movieId).subscribe({
      next: (response) => {
        const trailer = response.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          this.trailerKey = trailer.key;
        }
      },
      error: (err) => console.log('Error loading trailer', err)
    })
  }

  openTrailer() {
    if (this.trailerKey) {
      this.showTrailer = true;
    }
  }

  closeTrailer() {
    this.showTrailer = false;
  }

  obtenerRecomendaciones(id: string) {
    this.movieS.getRecommendations('movie', id).subscribe({
      next: (res) => {
        this.recommendations = this.movieS.filterResults(res.results);
      },
      error: (err) => console.log('Error recommendations', err)
    })
  }

  toggleRecommendations() {
    this.showAllRecommendations = !this.showAllRecommendations;
  }

  // Share functionality
  showShareMenu = false;

  toggleShareMenu() {
    this.showShareMenu = !this.showShareMenu;
  }

  getShareUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  getShareText(): string {
    return this.movie ? `¡Mira "${this.movie.title}"! ${this.movie.overview.substring(0, 100)}...` : '';
  }

  shareWhatsApp() {
    const url = this.getShareUrl();
    const text = this.getShareText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    this.showShareMenu = false;
  }

  shareFacebook() {
    const url = this.getShareUrl();
    // Direct Facebook share - opens Facebook in new window
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=600');
    this.showShareMenu = false;
  }

  shareTwitter() {
    const url = this.getShareUrl();
    const text = this.getShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    this.showShareMenu = false;
  }

  shareEmail() {
    const url = this.getShareUrl();
    const text = this.getShareText();
    const subject = this.movie ? `Te recomiendo: ${this.movie.title}` : 'Te recomiendo esta película';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    this.showShareMenu = false;
  }

  copyLink() {
    const url = this.getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('¡Link copiado al portapapeles!');
      });
    }
    this.showShareMenu = false;
  }
}
