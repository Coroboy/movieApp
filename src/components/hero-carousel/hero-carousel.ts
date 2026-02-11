import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../../app/interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-carousel',
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black"
         (mouseenter)="pauseAutoPlay()" 
         (mouseleave)="resumeAutoPlay()">
      
      @for (item of items; track item.id; let i = $index) {
        <div 
          (click)="navigateToDetail(item)"
          class="absolute inset-0 transition-opacity duration-700 cursor-pointer"
          [class.opacity-100]="currentIndex === i"
          [class.opacity-0]="currentIndex !== i"
          [class.pointer-events-none]="currentIndex !== i">
          
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img 
              [src]="'https://image.tmdb.org/t/p/original' + item.backdrop_path" 
              [alt]="item.title || item.name"
              class="w-full h-full object-cover">
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
            <div class="max-w-2xl space-y-4 md:space-y-6">
              <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight">
                {{ item.title || item.name }}
              </h1>
              
              <div class="flex items-center gap-4 text-sm md:text-base">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-white font-bold text-lg md:text-xl">{{ item.vote_average | number:'1.1-1' }}</span>
                </div>
                
                <span class="text-gray-300 font-semibold">
                  {{ (item.release_date || item.first_air_date) | date:'yyyy' }}
                </span>
                
                <span class="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full font-bold text-xs uppercase border border-yellow-400/30">
                  {{ item.media_type === 'movie' ? 'Película' : 'Serie' }}
                </span>
              </div>

              <p class="text-gray-200 text-base md:text-lg leading-relaxed line-clamp-3 md:line-clamp-4 drop-shadow-lg">
                {{ item.overview }}
              </p>

              <div class="flex gap-3 pt-2">
                <button class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Navigation Arrows -->
      <button 
        (click)="prevSlide(); $event.stopPropagation()"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 z-10">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button 
        (click)="nextSlide(); $event.stopPropagation()"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 z-10">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Dot Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        @for (item of items; track item.id; let i = $index) {
          <button
            (click)="goToSlide(i); $event.stopPropagation()"
            class="h-3 rounded-full transition-all duration-500 ease-in-out transform"
            [class.w-10]="currentIndex === i"
            [class.w-3]="currentIndex !== i"
            [class.bg-yellow-400]="currentIndex === i"
            [class.bg-white/40]="currentIndex !== i"
            [class.shadow-lg]="currentIndex === i"
            [class.shadow-yellow-400/50]="currentIndex === i"
            [class.opacity-100]="currentIndex === i"
            [class.opacity-60]="currentIndex !== i"
            [class.hover:bg-white/80]="currentIndex !== i"
            [class.hover:opacity-100]="currentIndex !== i"
            [class.hover:scale-125]="currentIndex !== i"
            [attr.aria-label]="'Ir a slide ' + (i + 1)"
            [attr.aria-current]="currentIndex === i ? 'true' : 'false'">
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HeroCarousel implements OnInit, OnDestroy {
  @Input({ required: true }) items!: Result[];

  currentIndex = 0;
  autoPlayInterval: any;
  router = inject(Router);

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
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
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  navigateToDetail(item: Result) {
    const type = item.media_type === 'movie' ? 'movie' : 'series';
    this.router.navigate([`/${type}`, item.id]);
  }
}
