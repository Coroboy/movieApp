
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ServerOption {
  name: string;
  id: string;
}

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl mx-auto">
      <!-- Server Selection Tabs -->
      <div class="flex flex-wrap gap-2 mb-4 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <span class="text-gray-400 text-sm font-medium flex items-center px-2">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          Servidores:
        </span>
        @for (server of servers; track server.id) {
          <button 
            (click)="selectServer(server.id)"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2"
            [class.bg-gradient-to-r]="currentServer === server.id"
            [class.from-purple-600]="currentServer === server.id"
            [class.to-blue-600]="currentServer === server.id"
            [class.text-white]="currentServer === server.id"
            [class.shadow-lg]="currentServer === server.id"
            [class.bg-gray-700]="currentServer !== server.id"
            [class.text-gray-300]="currentServer !== server.id"
            [class.hover:bg-gray-600]="currentServer !== server.id"
          >
            {{ server.name }}
            @if (currentServer === server.id) {
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            }
          </button>
        }
      </div>

      <!-- Player Container -->
      <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">
        @if (safeUrl) {
          <iframe 
            [src]="safeUrl"
            class="w-full h-full border-0 absolute inset-0 z-10"
            allowfullscreen
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
            referrerpolicy="origin"
          ></iframe>
        } @else {
          <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p class="animate-pulse">Cargando reproductor...</p>
          </div>
        }
      </div>

      <!-- User Notice -->
      <div class="mt-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in-up">
        <svg class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h4 class="text-yellow-500 font-bold text-sm mb-1">💡 Tips de Reproducción:</h4>
          <ul class="text-gray-300 text-sm leading-relaxed list-disc list-inside space-y-1">
             <li>Si el video no carga, prueba cambiando de <strong>Servidor</strong> arriba.</li>
             <li>Para audio latino, busca el icono de configuración ⚙️ o menú dentro del video.</li>
             <li>Recomendamos usar el navegador <strong>Brave</strong> o extensiones AdBlock para evitar publicidad.</li>
          </ul>
        </div>
      </div>
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
  @Input() type: 'movie' | 'tv' = 'movie';
  @Input() season?: number;
  @Input() episode?: number;

  private sanitizer = inject(DomSanitizer);
  safeUrl: SafeResourceUrl | null = null;
  currentServer: string = 'vidsrc';

  servers: ServerOption[] = [
    { name: 'Opción 1 (VidSrc Pro)', id: 'vidsrc' },
    { name: 'Opción 2 (VidSrc To)', id: 'vidsrcto' },
    { name: 'Opción 3 (2Embed)', id: '2embed' },
    { name: 'Opción 4 (SuperEmbed)', id: 'superembed' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tmdbId'] || changes['type'] || changes['season'] || changes['episode']) {
      this.updateUrl();
    }
  }

  selectServer(serverId: string) {
    this.currentServer = serverId;
    this.updateUrl();
  }

  private updateUrl(): void {
    if (!this.tmdbId) return;

    let url = '';
    const s = this.season || 1;
    const e = this.episode || 1;

    switch (this.currentServer) {
      case 'vidsrc': // vidsrc.net / .me
        if (this.type === 'movie') {
          url = `https://vidsrc.me/embed/movie?tmdb=${this.tmdbId}`;
        } else {
          url = `https://vidsrc.me/embed/tv?tmdb=${this.tmdbId}&season=${s}&episode=${e}`;
        }
        break;
      case 'vidsrcto': // vidsrc.to
        if (this.type === 'movie') {
          url = `https://vidsrc.to/embed/movie/${this.tmdbId}`;
        } else {
          url = `https://vidsrc.to/embed/tv/${this.tmdbId}/${s}/${e}`;
        }
        break;
      case '2embed': // 2embed.cc
        if (this.type === 'movie') {
          url = `https://www.2embed.cc/embed/${this.tmdbId}`;
        } else {
          url = `https://www.2embed.cc/embedtv/${this.tmdbId}&s=${s}&e=${e}`;
        }
        break;
      case 'superembed': // superembed
        if (this.type === 'movie') {
          url = `https://multiembed.mov/?video_id=${this.tmdbId}&tmdb=1`;
        } else {
          url = `https://multiembed.mov/?video_id=${this.tmdbId}&tmdb=1&s=${s}&e=${e}`;
        }
        break;
    }

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
