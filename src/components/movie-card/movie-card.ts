import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { Router } from '@angular/router';
import { FavoritesService } from '../../app/services/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  template: ` <div class="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs relative" [ngClass]="{'flex flex-col h-full': isCompact}">
                <!-- Favorite Button -->
                <button (click)="toggleFavorite($event)" 
                        class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 transition-colors duration-300" 
                       [ngClass]="{'text-red-500 fill-current': isFavorite, 'text-white': !isFavorite}"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <img class="rounded-base w-full object-cover" [ngClass]="{'h-64': isCompact}" src="https://image.tmdb.org/t/p/w500{{movie.poster_path}}" alt=""/>
                <h5 class="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading" [ngClass]="{'line-clamp-2 h-16': isCompact}">{{movie.title || movie.name}}</h5>
                <p class="mb-6 text-body" [ngClass]="{'line-clamp-3 flex-grow': isCompact}"> 
                  {{
                      (movie.overview || '').length > 50 ? (movie.overview || '').substring
                      (0,80) + '...' : (movie.overview || '')
                  }}
                </p>
                <div class="flex flex-row gap-2" [ngClass]="{'mt-auto': isCompact}">
                  <a (click)="navigateToMovie()" class="inline-flex items-center text-body bg-neutral-secondary-medium box-border border boder-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer">
                      Read more
                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmins="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                  </a>
                  @if (type === 'movie') {
                    <a class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1" 
                       href="https://vidlink.pro/{{type}}/{{movie.id}}">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span class="text-sm">Play</span>
                    </a>
                  } @else {
                    <button class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1"
                            (click)="navigateToMovie()">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span class="text-sm">Episodes</span>
                    </button>
                  }
                </div>
              </div>`
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