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
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          [class.opacity-100]="currentIndex === i"
          [class.opacity-0]="currentIndex !== i"
          [class.z-10]="currentIndex === i">
          
          <!-- Background with Image -->
          <div class="absolute inset-0 overflow-hidden">
            <!-- Static Backdrop (Ken Burns) -->
            <img 
              [src]="'https://image.tmdb.org/t/p/original' + item.backdrop_path" 
              [alt]="item.title || item.name"
              class="w-full h-full object-cover transition-transform scale-100"
              [class.animate-ken-burns]="currentIndex === i">
            
            <!-- Refined HBO-style Gradients -->
            <div class="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 h-2/3 z-20 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-x-0 top-0 h-32 z-20 bg-gradient-to-b from-black/60 to-transparent"></div>
            
            <!-- HBO Max Bottom Fade to Dark Background -->
            <div class="absolute inset-x-0 bottom-0 h-96 z-30 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"></div>
          </div>

          <!-- Content -->
          <div class="relative h-full w-full px-12 md:px-28 flex items-center z-30">
            <div class="w-full animate-fade-in-up">
              <!-- Content Wrapper with Fixed Bottom Alignment for Buttons -->
              <div class="flex flex-col h-full justify-center">
                
                <div class="space-y-3 md:space-y-6">
                    <!-- Title -->
                    <h1 class="text-2xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl max-w-[85%] md:max-w-full">
                      {{ (item.title || item.name) | uppercase }}
                    </h1>
                    
                    <!-- Metadata -->
                    <div class="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-1 text-[10px] md:text-lg font-bold text-white/90">
                      <span>{{ (item.release_date || item.first_air_date) | date:'yyyy' }}</span>
                      
                      <span class="flex items-center gap-2 md:gap-4">
                        <span class="px-1 py-0.5 border border-white/40 rounded text-[8px] md:text-[10px]">
                          {{ getCertification(item.id) }}
                        </span>
                        <span>{{ getRuntime(item.id) }}</span>
                      </span>

                      <span class="text-white/60">•</span>
                      
                      <span class="text-white/80">
                        {{ getGenreNames(item.genre_ids) }}
                      </span>
                    </div>

                    <!-- Description with Fixed Height Container -->
                    <div class="min-h-[40px] md:min-h-[80px] md:max-w-[70%] lg:max-w-[50%]">
                        <p class="text-white/80 text-xs md:text-lg lg:text-xl leading-relaxed line-clamp-2 md:line-clamp-3 font-medium">
                          {{ item.overview }}
                        </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Improved Navigation Arrows - Visible on Mobile -->
      <button 
        (click)="prevSlide(); $event.stopPropagation()"
        class="absolute left-1 md:left-6 top-1/2 -translate-y-1/2 p-2 text-yellow-400/30 hover:text-yellow-400 transition-all z-40 cursor-pointer">
        <svg class="w-6 h-6 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button 
        (click)="nextSlide(); $event.stopPropagation()"
        class="absolute right-1 md:right-6 top-1/2 -translate-y-1/2 p-2 text-yellow-400/30 hover:text-yellow-400 transition-all z-40 cursor-pointer">
        <svg class="w-6 h-6 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Dot Indicators -->
      <div class="absolute bottom-16 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-40">
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
      to { transform: scale(1.15); }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
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
    this.fetchMetadata();
  }
  get items() { return this._items; }
  private _items: Result[] = [];

  currentIndex = 0;
  autoPlayInterval: any;
  itemDetails: { [key: number]: any } = {};

  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  movieService = inject(MovieService);

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
    }, 5000); // 5 seconds interval
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
    this.cdr.markForCheck();
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.cdr.markForCheck();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.cdr.markForCheck();
  }

  fetchMetadata() {
    this.items.forEach(item => {
      const type = item.media_type === 'movie' || (item.title && !item.first_air_date) ? 'movie' : 'series';

      // Fetch Detailed Info (Runtime, Certifications)
      const detailObs = type === 'movie'
        ? this.movieService.obtenerMovie(item.id.toString())
        : this.movieService.obtenerSerie(item.id.toString());

      detailObs.subscribe({
        next: (detail) => {
          this.itemDetails[item.id] = detail;
          this.cdr.markForCheck();
        }
      });
    });
  }

  getRuntime(id: number): string {
    const detail = this.itemDetails[id];
    if (!detail) return '...';

    if (detail.runtime) {
      const hours = Math.floor(detail.runtime / 60);
      const minutes = detail.runtime % 60;
      return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
    }

    if (detail.number_of_seasons) {
      return detail.number_of_seasons === 1 ? '1 Temporada' : `${detail.number_of_seasons} Temporadas`;
    }

    return '';
  }

  getCertification(id: number): string {
    const detail = this.itemDetails[id];
    if (!detail) return '...';

    // Movie Certifications
    if (detail.release_dates) {
      const results = detail.release_dates.results || [];
      const usResult = results.find((r: any) => r.iso_3166_1 === 'US') || results[0];
      if (usResult && usResult.release_dates) {
        return usResult.release_dates[0].certification || (detail.adult ? '18+' : '12+');
      }
    }

    // TV Certifications
    if (detail.content_ratings) {
      const results = detail.content_ratings.results || [];
      const usResult = results.find((r: any) => r.iso_3166_1 === 'US') || results[0];
      if (usResult) {
        return usResult.rating || (detail.adult ? '18+' : '12+');
      }
    }

    return detail.adult ? '18+' : '12+';
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
}
