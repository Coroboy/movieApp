
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl mx-auto">
      <!-- Player Container -->
      <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800/50 group">
        
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
                <div class="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                
                <button class="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-600">
                  <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Header Text in Splash -->
            <div class="absolute bottom-10 left-10 right-10 flex flex-col items-center">
               <span class="px-4 py-1.5 bg-purple-600 text-white text-xs font-black rounded-full uppercase tracking-widest mb-4 shadow-lg shadow-purple-600/50">Disponible Ahora</span>
               <h3 class="text-3xl font-black text-white text-center drop-shadow-lg tracking-tight">Haz clic para reproducir</h3>
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
            <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-4 bg-gray-900">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p class="animate-pulse font-bold tracking-widest uppercase text-xs">Iniciando Servidor...</p>
            </div>
          }
        }
      </div>

      <!-- User Notice (Subtle) -->
      @if (isPlaying) {
        <div class="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4 animate-fade-in-up">
          <div class="p-2 bg-yellow-400/20 rounded-lg">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-gray-400 text-sm">
            <span class="text-white font-bold">Tip:</span> Para audio Latino, busca el icono <span class="text-white">⚙️</span> en el reproductor.
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
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
