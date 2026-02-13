import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MovieService } from '../../app/services/movieService';
import { Result, MovieDetail, Season } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { FavoritesService } from '../../app/services/favorites.service';
import { LikesService, LikeStatus } from '../../app/services/likes.service';
import { FormsModule } from '@angular/forms';
import { MoviePlayer } from '../../components/movie-player/movie-player';

@Component({
    selector: 'app-series-detail',
    imports: [MovieCard, DatePipe, CommonModule, FormsModule, MoviePlayer, RouterModule],
    templateUrl: './series-detail.html',
    styles: `
    :host {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes scaleX {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
    }
    .animate-scale-x {
      animation: scaleX 0.4s ease-out forwards;
      transform-origin: left;
    }
    select option {
      background: #111 !important;
      color: white !important;
    }
  `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SeriesDetail {
    activeRoute = inject(ActivatedRoute)
    movieS = inject(MovieService)
    favoritesService = inject(FavoritesService)
    likesService = inject(LikesService)
    sanitizer = inject(DomSanitizer)
    meta = inject(Meta)
    titleService = inject(Title)
    serieId: string = ''
    serie!: MovieDetail
    recommendations: Result[] = []
    trailerKey: string | null = null
    showTrailer = false
    showPlayer = false
    showAllRecommendations = false

    // UI State
    selectedSeason: Season | null = null;
    selectedSeasonNumber: number = 1;
    selectedEpisodeNumber: number = 1;
    episodes: any[] = []

    constructor() {
        this.activeRoute.params.subscribe(params => {
            this.serieId = params['id'];
            this.obtenerSerie();
            window.scrollTo(0, 0);
        })
    }

    get currentEpisode() {
        return this.episodes.find(e => e.episode_number === this.selectedEpisodeNumber);
    }

    get isFavorite(): boolean {
        return this.serie ? this.favoritesService.isFavorite(this.serie.id) : false;
    }

    get likeStatus(): LikeStatus {
        return this.serie ? this.likesService.getLikeStatus(this.serie.id) : null;
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
        if (this.serie) {
            const result: Result = {
                id: this.serie.id,
                title: this.serie.name || this.serie.title,
                poster_path: this.serie.poster_path,
                vote_average: this.serie.vote_average,
                release_date: this.serie.first_air_date || this.serie.release_date,
                overview: this.serie.overview,
                adult: this.serie.adult,
                backdrop_path: this.serie.backdrop_path,
                genre_ids: this.serie.genres.map(g => g.id),
                original_language: this.serie.original_language,
                original_title: this.serie.original_name || this.serie.original_title,
                popularity: this.serie.popularity,
                video: false,
                vote_count: this.serie.vote_count,
                media_type: 'tv',
                name: this.serie.name,
                original_name: this.serie.original_name,
                first_air_date: this.serie.first_air_date
            };
            this.favoritesService.toggleFavorite(result);
        }
    }

    toggleLike() {
        if (this.serie) {
            this.likesService.toggleLike(this.serie.id, 'tv');
        }
    }

    toggleDislike() {
        if (this.serie) {
            this.likesService.toggleDislike(this.serie.id, 'tv');
        }
    }

    obtenerSerie() {
        this.movieS.obtenerSerie(this.serieId).subscribe({
            next: (serie) => {
                console.log(serie);
                this.serie = serie;
                this.updateMetaTags();
                if (this.serie.seasons && this.serie.seasons.length > 0) {
                    // Try to find Season 1 first, otherwise take the first one available
                    const season1 = this.serie.seasons.find(s => s.season_number === 1);
                    this.selectedSeason = season1 || this.serie.seasons[0];
                    this.selectedSeasonNumber = this.selectedSeason.season_number;
                    this.loadSeasonData();
                }
                this.obtenerRecomendaciones(this.serieId);
                this.loadTrailer();
            },
            error: (err) => console.log('Error', err)
        });
    }

    updateMetaTags() {
        if (!this.serie) return;

        const year = this.serie.first_air_date ? new Date(this.serie.first_air_date).getFullYear() : '';
        const title = `${this.serie.name} ${year ? '(' + year + ')' : ''} - movieApp`;
        const description = this.serie.overview
            ? this.serie.overview.substring(0, 200) + (this.serie.overview.length > 200 ? '...' : '')
            : `Disfruta de ${this.serie.name} en movieApp. Encuentra información de temporadas, episodios y mucho más.`;

        // Use w1280 for better social compatibility
        const image = this.serie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${this.serie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w780${this.serie.poster_path}`;

        const url = window.location.href;

        // Update Browser Title
        this.titleService.setTitle(title);

        // Standard Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: `${this.serie.name}, serie, ${year}, episodios, temporadas, streaming, movieApp` });
        this.meta.updateTag({ name: 'author', content: 'movieApp' });

        // Open Graph Tags (Facebook, WhatsApp, LinkedIn)
        this.meta.updateTag({ property: 'og:site_name', content: 'movieApp' });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:image:width', content: '1280' });
        this.meta.updateTag({ property: 'og:image:height', content: '720' });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: 'video.tv_show' });

        // Twitter Tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
        this.meta.updateTag({ name: 'twitter:image:alt', content: `Poster de ${this.serie.name}` });
    }

    loadTrailer() {
        this.movieS.getSeriesVideos(this.serieId).subscribe({
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

    openPlayer() {
        this.showPlayer = true;
    }

    playFromStart() {
        if (this.serie?.seasons && this.serie.seasons.length > 0) {
            const season1 = this.serie.seasons.find(s => s.season_number === 1);
            this.selectedSeason = season1 || this.serie.seasons[0];
            this.selectedSeasonNumber = this.selectedSeason.season_number;
            this.loadSeasonData();
        }
        this.selectedEpisodeNumber = 1;
        this.showPlayer = true;
    }

    closePlayer() {
        this.showPlayer = false;
    }

    selectEpisode(episode: any) {
        this.selectedEpisodeNumber = episode.episode_number;
        this.openPlayer();
    }

    loadSeasonData() {
        if (this.selectedSeasonNumber) {
            console.log(`Loading season ${this.selectedSeasonNumber} for series ${this.serieId}`);
            this.movieS.obtenerTemporada(this.serieId, this.selectedSeasonNumber).subscribe({
                next: (season) => {
                    console.log('Season data received:', season);
                    console.log('Episodes count:', season.episodes?.length || 0);
                    // Don't filter episodes - assign all of them
                    this.episodes = season.episodes || [];
                    console.log('Episodes assigned:', this.episodes.length);
                },
                error: (err) => {
                    console.error('Error loading season:', err);
                    this.episodes = [];
                }
            });
        }
    }

    onSeasonChange() {
        this.selectedEpisodeNumber = 1;
        this.loadSeasonData();
    }

    obtenerRecomendaciones(id: string) {
        this.movieS.getRecommendations('tv', id).subscribe({
            next: (res) => {
                const filtered = this.movieS.filterResults(res.results);
                if (filtered.length > 0) {
                    this.recommendations = filtered;
                } else if (this.serie && this.serie.genres.length > 0) {
                    // Fallback to genre-based discovery if no direct recommendations
                    this.movieS.getByGenre('tv', this.serie.genres[0].id).subscribe({
                        next: (fallbackRes) => {
                            this.recommendations = this.movieS.filterResults(fallbackRes.results.filter(s => s.id !== this.serie.id));
                        }
                    });
                }
            },
            error: (err) => console.log('Error recommendations', err)
        });
    }

    toggleRecommendations() {
        this.showAllRecommendations = !this.showAllRecommendations;
    }

    getDirector(): string {
        if (!this.serie?.credits) return '';
        const crew = this.serie.credits.crew;
        const director = crew.find(person => person.job === 'Director' || person.job === 'Executive Producer' || person.job === 'Creator');
        return director ? director.name : '';
    }

    get mainActors(): any[] {
        if (!this.serie?.credits) return [];
        return this.serie.credits.cast.slice(0, 5);
    }

    get ratingScore(): number {
        return this.serie ? Math.round(this.serie.vote_average * 10) : 0;
    }

    get ratingCircleStyle(): string {
        const dashOffset = 251.2 - (251.2 * this.ratingScore) / 100;
        return `stroke-dashoffset: ${dashOffset}; transition: stroke-dashoffset 1s ease-in-out;`;
    }

    // Share functionality
    showShareMenu = false;

    toggleShareMenu() {
        this.showShareMenu = !this.showShareMenu;
        if (this.showShareMenu) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }

    getShareUrl(): string {
        return typeof window !== 'undefined' ? window.location.href : '';
    }

    getShareText(): string {
        return this.serie ? `¡Mira "${this.serie.name}"! ${this.serie.overview.substring(0, 100)}...` : '';
    }

    shareWhatsApp() {
        const url = this.getShareUrl();
        const text = this.getShareText();
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        this.showShareMenu = false;
        document.body.classList.remove('overflow-hidden');
    }

    shareFacebook() {
        const url = this.getShareUrl();
        // Direct Facebook share - opens Facebook in new window
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=600');
        this.showShareMenu = false;
        document.body.classList.remove('overflow-hidden');
    }

    shareTwitter() {
        const url = this.getShareUrl();
        const text = this.getShareText();
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        this.showShareMenu = false;
        document.body.classList.remove('overflow-hidden');
    }

    shareEmail() {
        const url = this.getShareUrl();
        const text = this.getShareText();
        const subject = this.serie ? `Te recomiendo: ${this.serie.name}` : 'Te recomiendo esta serie';
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        this.showShareMenu = false;
        document.body.classList.remove('overflow-hidden');
    }

    copyLink() {
        const url = this.getShareUrl();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('¡Link copiado al portapapeles!');
            });
        }
        this.showShareMenu = false;
        document.body.classList.remove('overflow-hidden');
    }
}
