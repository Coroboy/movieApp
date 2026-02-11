import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { Router } from '@angular/router';
import { FavoritesService } from '../../app/services/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  template: `
    <div (click)="navigateToMovie()" 
         class="group relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-500 cursor-pointer hover:z-50 hover:shadow-2xl hover:ring-2 hover:ring-yellow-400/40">
      
      <!-- Favorite Button -->
      <button (click)="toggleFavorite($event)" 
              class="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-red-500/80 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-colors duration-300" 
             [ngClass]="{'text-red-500 fill-current': isFavorite, 'text-white': !isFavorite}"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- Poster Image with Natural Aspect Ratio -->
      <img class="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110" 
           [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
           [alt]="movie.title || movie.name"/>

      <!-- Elegant Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
        <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h5 class="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
            {{ movie.title || movie.name }}
          </h5>
          <p class="text-sm text-gray-300 line-clamp-3 mb-2 font-light leading-relaxed">
            {{ movie.overview }}
          </p>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-yellow-400 text-xs font-bold px-2 py-0.5 bg-yellow-400/10 rounded-full border border-yellow-400/20">
              ★ {{ movie.vote_average | number:'1.1-1' }}
            </span>
            <span class="text-gray-400 text-xs font-medium italic">
              {{ (movie.release_date || movie.first_air_date) | date:'yyyy' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  `
  ,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MovieCard {
  @Input({ required: true }) movie!: Result
  @Input() type: 'movie' | 'tv' = 'movie'; // Type is 'movie' by default
  @Input() isCompact: boolean = false; // New input for compact mode
  router = inject(Router)
  favoritesService = inject(FavoritesService);

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent navigating to movie details
    // Ensure media_type is set for favorites
    if (!this.movie.media_type) {
      this.movie.media_type = this.type;
    }
    this.favoritesService.toggleFavorite(this.movie);
  }

  //Declaracion del metodo navigateToMovie
  navigateToMovie() {
    if (this.type === 'movie') {
      this.router.navigateByUrl(`/movie/${this.movie.id}`)
    } else {
      this.router.navigateByUrl(`/series/${this.movie.id}`)
    }
  }
}