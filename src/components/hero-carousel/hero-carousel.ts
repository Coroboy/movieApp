import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../../app/interfaces/interface';
import { CommonModule } from '@angular/common';
import { GENRE_MAP } from '../../app/constants/genres';
import { MovieService } from '../../app/services/movieService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hero-carousel',
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black cursor-pointer group/carousel"
         (mouseenter)="pauseAutoPlay()" 
         (mouseleave)="resumeAutoPlay()"
         (click)="navigateToDetail(items[currentIndex])">
      
      @for (item of items; track item.id; let i = $index) {
        <div 
          class="absolute inset-0 transition-opacity duration-1000"
          [class.opacity-100]="currentIndex === i"
          [class.opacity-0]="currentIndex !== i"
          [class.z-10]="currentIndex === i">
          
          <!-- Background with Image & Video -->
          <div class="absolute inset-0 overflow-hidden">
            <!-- Static Backdrop (Ken Burns) -->
            <img 
              [src]="'https://image.tmdb.org/t/p/original' + item.backdrop_path" 
              [alt]="item.title || item.name"
              class="w-full h-full object-cover transition-transform scale-100"
              [class.animate-ken-burns]="currentIndex === i">
            
            <!-- Video Overlay (YouTube Muted) -->
            @if (currentIndex === i && trailerUrls[item.id]) {
              <div class="absolute inset-0 z-10 animate-fade-in transition-opacity duration-1000 bg-black">
                <iframe 
                  [src]="trailerUrls[item.id]"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none"
                  frameborder="0" 
                  allow="autoplay; encrypted-media">
                </iframe>
              </div>
            }

            <!-- Refined HBO-style Gradients -->
            <div class="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 h-2/3 z-20 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-x-0 top-0 h-32 z-20 bg-gradient-to-b from-black/60 to-transparent"></div>
            
            <!-- HBO Max Bottom Fade to Dark Background -->
            <div class="absolute inset-x-0 bottom-0 h-96 z-30 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>
          </div>

          <!-- Content -->
          <div class="relative h-full max-w-[1800px] mx-auto px-12 md:px-24 flex items-center z-30">
            <div class="max-w-3xl animate-fade-in-up">
              <!-- Content Wrapper with Fixed Bottom Alignment for Buttons -->
              <div class="flex flex-col h-full justify-center">
                
                <div class="space-y-4 md:space-y-6">
                    <!-- Title -->
                    <h1 class="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-2xl">
                      {{ (item.title || item.name) | uppercase }}
                    </h1>
                    
                    <!-- Metadata -->
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-lg font-bold text-white/90">
                      <span>{{ (item.release_date || item.first_air_date) | date:'yyyy' }}</span>
                      
                      <span class="flex items-center gap-4">
                        <span class="px-1.5 py-0.5 border border-white/40 rounded text-[10px]">
                          {{ (item.adult) ? '18+' : '12+' }}
                        </span>
                        <span>{{ item.media_type === 'movie' || item.title ? '2 h 15 min' : '1 Temporada' }}</span>
                      </span>

                      <span class="text-white/60">•</span>
                      
                      <span class="text-white/80">
                        {{ getGenreNames(item.genre_ids) }}
                      </span>
                    </div>

                    <!-- Description with Fixed Height Container -->
                    <div class="min-h-[50px] md:min-h-[80px] max-w-xl">
                        <p class="text-white/80 text-xs md:text-sm leading-relaxed line-clamp-2 font-medium">
                          {{ item.overview }}
                        </p>
                    </div>
                </div>

                <!-- Action Buttons Removed, except Mute -->
                <div class="flex items-center gap-4 mt-8">
                  <!-- Mute/Unmute Button -->
                  <button
                    (click)="toggleMute(); $event.stopPropagation()"
                    class="p-3.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-2xl"
                    [title]="isMuted ? 'Activar sonido' : 'Desactivar sonido'">
                    @if (isMuted) {
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    } @else {
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Improved Navigation Arrows -->
      <button 
        (click)="prevSlide(); $event.stopPropagation()"
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-all z-40 cursor-pointer hidden md:block">
        <svg class="w-10 h-10 lg:w-14 lg:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button 
        (click)="nextSlide(); $event.stopPropagation()"
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-all z-40 cursor-pointer hidden md:block">
        <svg class="w-10 h-10 lg:w-14 lg:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Mute button removed from here -->

      <!-- Dot Indicators -->
      <div class="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        @for (item of items; track item.id; let i = $index) {
          <button
            (click)="goToSlide(i); $event.stopPropagation()"
            class="w-2 h-2 rounded-full transition-all duration-300"
            [class.bg-white]="currentIndex === i"
            [class.w-4]="currentIndex === i"
            [class.bg-white/40]="currentIndex !== i"
            [class.hover:bg-white/60]="currentIndex !== i"
            [attr.aria-label]="'Ir a slide ' + (i + 1)">
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .animate-fade-in {
       animation: fadeIn 1.5s ease-in forwards;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    .animate-ken-burns {
      animation: kenburns 20s linear infinite alternate;
    }
    @keyframes kenburns {
      from { transform: scale(1); }
      to { transform: scale(1.1); }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCarousel implements OnInit, OnDestroy {
  @Input({ required: true }) set items(value: Result[]) {
    this._items = value;
    this.fetchTrailers();
  }
  get items() { return this._items; }
  private _items: Result[] = [];

  currentIndex = 0;
  autoPlayInterval: any;
  trailerUrls: { [key: number]: SafeResourceUrl } = {};
  isMuted = true;

  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  movieService = inject(MovieService);
  sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.markForCheck();
    }, 8000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  pauseAutoPlay() {
    this.stopAutoPlay();
  }

  resumeAutoPlay() {
    this.startAutoPlay();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.applyAudioState(); // Apply cached audio state
    this.cdr.markForCheck();
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.applyAudioState(); // Apply cached audio state
    this.cdr.markForCheck();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.applyAudioState(); // Apply cached audio state
    this.cdr.markForCheck();
  }

  fetchTrailers() {
    this.items.forEach(item => {
      const type = item.media_type === 'movie' || (item.title && !item.first_air_date) ? 'movie' : 'series';
      const obs = type === 'movie'
        ? this.movieService.getMovieVideos(item.id.toString())
        : this.movieService.getSeriesVideos(item.id.toString());

      obs.subscribe({
        next: (res) => {
          const trailer = res.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) {
            // Removed mute=1 from URL to allow programmed control
            const url = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&loop=1&playlist=${trailer.key}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`;
            this.trailerUrls[item.id] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            this.cdr.markForCheck();

            // Re-apply mute state after a short delay to ensure iframe is ready
            setTimeout(() => this.applyAudioState(), 1000);
          }
        }
      });
    });
  }

  navigateToDetail(item: Result) {
    if (!item) return;
    const type = item.media_type === 'movie' || item.title ? 'movie' : 'series';
    this.router.navigate([`/${type}`, item.id]);
  }

  getGenreNames(genreIds: number[] | undefined): string {
    if (!genreIds || genreIds.length === 0) return '';
    return genreIds
      .slice(0, 2)
      .map(id => GENRE_MAP[id])
      .filter(name => !!name)
      .join(', ');
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyAudioState();
    this.cdr.markForCheck();
  }

  applyAudioState() {
    // Programmatic YouTube Control via postMessage
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      // Force mute if user wants mute, otherwise unmute
      const command = this.isMuted ? 'mute' : 'unMute';
      iframe.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    });
  }
}
