import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { Router } from '@angular/router';
import { FavoritesService } from '../../app/services/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  template: `
    <div (mouseenter)="onMouseEnter()" 
         (mouseleave)="onMouseLeave()"
         class="group relative cursor-pointer transition-all duration-300"
         [class.z-50]="isHovered"
         [class.z-0]="!isHovered">
      
      <!-- Card Container with Scale Transform -->
      <div class="relative transition-all duration-500 ease-out"
           [class.scale-130]="isHovered"
           [class.shadow-prime]="isHovered">
        
        <!-- Poster Image Section -->
        <div class="relative overflow-hidden rounded-t-xl bg-gray-900">
          <img class="w-full h-auto object-cover" 
               [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
               [alt]="movie.title || movie.name"/>
          
          <!-- Favorite Button (Always Visible on Hover) -->
          <button (click)="toggleFavorite($event)" 
                  class="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-red-500/90 transition-all duration-300"
                  [class.opacity-0]="!isHovered"
                  [class.opacity-100]="isHovered">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-colors duration-300" 
                 [ngClass]="{'text-red-500 fill-current': isFavorite, 'text-white': !isFavorite}"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <!-- Expandable Content Drawer (Prime Video Style) -->
        <div *ngIf="isHovered" 
             class="bg-[#1a242f] rounded-b-xl p-4 animate-slide-down">
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-2 mb-3">
            <button (click)="navigateToMovie()" 
                    class="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 px-4 rounded-md transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              Reproducir
            </button>
            
            <button (click)="navigateToMovie()" 
                    class="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all duration-200">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>

          <!-- Title -->
          <h5 class="text-white font-bold text-base mb-2 leading-tight line-clamp-2">
            {{ movie.title || movie.name }}
          </h5>

          <!-- Metadata -->
          <div class="flex items-center gap-3 mb-2 text-xs">
            <span class="text-yellow-400 font-bold flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ movie.vote_average | number:'1.1-1' }}
            </span>
            <span class="text-gray-400">{{ (movie.release_date || movie.first_air_date) | date:'yyyy' }}</span>
            <span class="px-2 py-0.5 bg-white/10 text-white rounded border border-white/20 text-[10px] font-bold">HD</span>
          </div>

          <!-- Synopsis -->
          <p class="text-gray-300 text-xs leading-relaxed line-clamp-2">
            {{ movie.overview || 'No hay descripción disponible.' }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    
    .scale-130 {
      transform: scale(1.3);
    }
    
    .shadow-prime {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    }
    
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MovieCard {
  @Input({ required: true }) movie!: Result
  @Input() type: 'movie' | 'tv' = 'movie';
  @Input() isCompact: boolean = false;

  router = inject(Router);
  favoritesService = inject(FavoritesService);

  isHovered: boolean = false;
  hoverTimeout: any;

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  onMouseEnter() {
    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Set a 500ms delay before showing the expanded content (Prime Video style)
    this.hoverTimeout = setTimeout(() => {
      this.isHovered = true;
    }, 500);
  }

  onMouseLeave() {
    // Clear the timeout if mouse leaves before 500ms
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Immediately hide the expanded content
    this.isHovered = false;
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    if (!this.movie.media_type) {
      this.movie.media_type = this.type;
    }
    this.favoritesService.toggleFavorite(this.movie);
  }

  navigateToMovie() {
    if (this.type === 'movie') {
      this.router.navigateByUrl(`/movie/${this.movie.id}`);
    } else {
      this.router.navigateByUrl(`/series/${this.movie.id}`);
    }
  }
}