import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MovieService } from '../../app/services/movieService';
import { Result, MovieDetail, Season } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { FavoritesService } from '../../app/services/favorites.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-series-detail',
    imports: [MovieCard, DatePipe, DecimalPipe, CommonModule, FormsModule],
    templateUrl: './series-detail.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SeriesDetail {
    activeRoute = inject(ActivatedRoute)
    movieS = inject(MovieService)
    favoritesService = inject(FavoritesService)
    sanitizer = inject(DomSanitizer)
    meta = inject(Meta)
    titleService = inject(Title)
    serieId: string = ''
    serie!: MovieDetail
    recommendations: Result[] = []
    trailerKey: string | null = null
    showTrailer = false
    showAllRecommendations = false

    // Season and Episode selection
    selectedSeason: Season | null = null;
    selectedSeasonNumber: number = 1;
    episodes: any[] = []

    constructor() {
        this.activeRoute.params.subscribe(params => {
            this.serieId = params['id'];
            this.obtenerSerie();
        })
    }

    get isFavorite(): boolean {
        return this.serie ? this.favoritesService.isFavorite(this.serie.id) : false;
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

    obtenerSerie() {
        this.movieS.obtenerSerie(this.serieId).subscribe({
            next: (serie) => {
                console.log(serie);
                this.serie = serie;
                this.updateMetaTags();
                if (this.serie.seasons && this.serie.seasons.length > 0) {
                    this.selectedSeason = this.serie.seasons[0];
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

        const title = `${this.serie.name} - movieApp`;
        const description = this.serie.overview || `Disfruta de ${this.serie.name} en movieApp. Encuentra información de temporadas, episodios y mucho más.`;
        const image = this.serie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${this.serie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${this.serie.poster_path}`;
        const url = window.location.href;

        // Update Browser Title
        this.titleService.setTitle(title);

        // Standard Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: `serie, ${this.serie.name}, movieApp, streaming, episodios, temporadas` });

        // Open Graph Tags (Facebook, WhatsApp, LinkedIn)
        this.meta.updateTag({ property: 'og:site_name', content: 'movieApp' });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: 'video.tv_show' });

        // Twitter Tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
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

    loadSeasonData() {
        if (this.selectedSeasonNumber) {
            this.movieS.obtenerTemporada(this.serieId, this.selectedSeasonNumber).subscribe({
                next: (season) => {
                    this.episodes = season.episodes;
                },
                error: (err) => console.log('Error loading season', err)
            });
        }
    }

    onSeasonChange() {
        if (this.selectedSeasonNumber) {
            this.loadSeasonData();
        }
    }

    obtenerRecomendaciones(id: string) {
        this.movieS.getRecommendations('tv', id).subscribe({
            next: (res) => {
                this.recommendations = this.movieS.filterResults(res.results);
            },
            error: (err) => console.log('Error recommendations', err)
        });
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
        return this.serie ? `¡Mira "${this.serie.name}"! ${this.serie.overview.substring(0, 100)}...` : '';
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
        const subject = this.serie ? `Te recomiendo: ${this.serie.name}` : 'Te recomiendo esta serie';
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
