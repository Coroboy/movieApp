
import { Component, Input, OnChanges, SimpleChanges, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex flex-col items-center justify-center p-4">
      
      <!-- Server Selection UI Grouped by Language -->
      <div class="w-full max-w-6xl mb-6 flex flex-wrap items-center justify-between gap-6 px-2">
        
        <!-- Spanish Section -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Español</span>
            <div class="h-[1px] w-8 bg-white/10"></div>
          </div>
          <div class="flex gap-2">
            @for (server of getServersByLang('es'); track server.id) {
              <button 
                (click)="changeServer(server.id)"
                [class]="currentServer === server.id 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'"
                class="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300"
              >
                {{ server.name }}
              </button>
            }
          </div>
        </div>

        <!-- English Section -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">English</span>
            <div class="h-[1px] w-8 bg-white/10"></div>
          </div>
          <div class="flex flex-wrap gap-2">
            @for (server of getServersByLang('en'); track server.id) {
              <button 
                (click)="changeServer(server.id)"
                [class]="currentServer === server.id 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'"
                class="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300"
              >
                {{ server.name }}
              </button>
            }
          </div>
        </div>
      </div>

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

      <!-- Helper / Warning -->
      <div class="mt-6 flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 max-w-2xl">
        <svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Sugerencia de Reproducción</p>
          <p class="text-xs text-white/40 leading-relaxed font-medium">Usa la sección <span class="text-white">Español</span> para contenido doblado (Vimeus) o <span class="text-white">English</span> para versión original. Si un servidor falla, intenta con los demás.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MoviePlayer implements OnChanges, OnDestroy {
  @Input({ required: true }) tmdbId!: string | number;
  @Input({ required: true }) posterPath!: string;
  @Input() type: 'movie' | 'tv' = 'movie';
  @Input() season?: number;
  @Input() episode?: number;

  private sanitizer = inject(DomSanitizer);
  safeUrl: SafeResourceUrl | null = null;
  isPlaying = false;

  currentServer: string = 'vimeus';

  servers = [
    { id: 'vimeus', name: 'Vimeus', lang: 'es' },
    { id: 'vidlink', name: 'VidLink', lang: 'en' },
    { id: 'vidsrc', name: 'VidSrc', lang: 'en' },
    { id: 'autoembed', name: 'AutoEmbed', lang: 'en' }
  ];

  getServersByLang(lang: 'es' | 'en') {
    return this.servers.filter(s => s.lang === lang);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tmdbId'] || changes['type'] || changes['season'] || changes['episode']) {
      if (this.isPlaying) {
        this.updateUrl();
      }
    }
  }

  play() {
    this.isPlaying = true;
    this.updateUrl();
  }

  changeServer(serverId: string) {
    this.currentServer = serverId;
    if (this.isPlaying) {
      this.updateUrl();
    }
  }

  private updateUrl(): void {
    if (!this.tmdbId) return;

    let url = '';
    const s = this.season || 1;
    const e = this.episode || 1;
    const vimeusKey = 'tXeWzSb3_zmKvo2bxgBWGhSEF2whYDigAMj8qdcacZc';

    switch (this.currentServer) {
      case 'vimeus':
        url = this.type === 'movie'
          ? `https://vimeus.com/e/movie?tmdb=${this.tmdbId}&view_key=${vimeusKey}`
          : `https://vimeus.com/e/serie?tmdb=${this.tmdbId}&s=${s}&e=${e}&view_key=${vimeusKey}`;
        break;
      case 'vidlink':
        url = this.type === 'movie'
          ? `https://vidlink.pro/movie/${this.tmdbId}`
          : `https://vidlink.pro/tv/${this.tmdbId}/${s}/${e}`;
        break;
      case 'vidsrc':
        url = this.type === 'movie'
          ? `https://vidsrc.me/embed/movie?tmdb=${this.tmdbId}`
          : `https://vidsrc.me/embed/tv?tmdb=${this.tmdbId}&sea=${s}&epi=${e}`;
        break;
      case 'autoembed':
        url = this.type === 'movie'
          ? `https://player.autoembed.cc/embed/movie/${this.tmdbId}`
          : `https://player.autoembed.cc/embed/tv/${this.tmdbId}/${s}/${e}`;
        break;
    }

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    // Explicitly clear the URL and state to ensure the iframe is destroyed and audio stops
    this.safeUrl = null;
    this.isPlaying = false;
  }
}
