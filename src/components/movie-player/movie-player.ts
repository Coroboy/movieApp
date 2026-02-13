
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex items-center justify-center p-4">
      <!-- Player Container -->
      <div class="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 group">
        
        @if (!isPlaying) {
          <!-- Splash Screen / Poster -->
          <div class="absolute inset-0 z-20 cursor-pointer overflow-hidden" (click)="play()">
            <!-- Backdrop Image -->
            <img 
              [src]="'https://image.tmdb.org/t/p/w1280' + posterPath" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              alt="Poster"
            >
            
            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

            <!-- Play Button Central -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="relative">
                <!-- Glowing effect behind button -->
                <div class="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                
                <button class="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        } @else {
          <!-- Active Iframe -->
          @if (safeUrl) {
            <iframe 
              [src]="safeUrl"
              class="w-full h-full border-0 absolute inset-0 z-10"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="origin"
            ></iframe>
          } @else {
            <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-4 bg-gray-900/50">
              <div class="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
              <p class="animate-pulse font-black tracking-widest uppercase text-[10px] text-white/40">Iniciando Servidor...</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MoviePlayer implements OnChanges {
  @Input({ required: true }) tmdbId!: string | number;
  @Input({ required: true }) posterPath!: string;
  @Input() type: 'movie' | 'tv' = 'movie';
  @Input() season?: number;
  @Input() episode?: number;

  private sanitizer = inject(DomSanitizer);
  safeUrl: SafeResourceUrl | null = null;
  isPlaying = false;

  currentServer: string = 'vimeus';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tmdbId'] || changes['type'] || changes['season'] || changes['episode']) {
      // If content changes while playing, reposition logic
      if (this.isPlaying) {
        this.updateUrl();
      }
    }
  }

  play() {
    this.isPlaying = true;
    this.updateUrl();
  }

  private updateUrl(): void {
    if (!this.tmdbId) return;

    let url = '';
    const s = this.season || 1;
    const e = this.episode || 1;
    const vimeusKey = 'tXeWzSb3_zmKvo2bxgBWGhSEF2whYDigAMj8qdcacZc';

    // We use Vimeus as the primary elegant solution requested
    if (this.type === 'movie') {
      url = `https://vimeus.com/e/movie?tmdb=${this.tmdbId}&view_key=${vimeusKey}`;
    } else {
      url = `https://vimeus.com/e/serie?tmdb=${this.tmdbId}&se=${s}&ep=${e}&view_key=${vimeusKey}`;
    }

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
