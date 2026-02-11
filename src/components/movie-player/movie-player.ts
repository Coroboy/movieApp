
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
      <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        @if (safeUrl) {
          <iframe 
            [src]="safeUrl"
            class="w-full h-full border-0 absolute inset-0"
            allowfullscreen
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
            referrerpolicy="origin"
          ></iframe>
        } @else {
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <p>Cargando reproductor...</p>
          </div>
        }
      </div>

      <!-- User Notice -->
      <div class="mt-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 flex items-start gap-3">
        <svg class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h4 class="text-yellow-500 font-bold text-sm mb-1">⚠️ Importante para ver en Español:</h4>
          <p class="text-gray-300 text-sm leading-relaxed">
            Una vez cargado el video, busca el icono de configuración o menú dentro del reproductor y selecciona 
            <span class="text-white font-bold bg-white/10 px-1 rounded">Latino</span> o 
            <span class="text-white font-bold bg-white/10 px-1 rounded">Español</span> 
            para cambiar el idioma del audio.
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tmdbId'] || changes['type'] || changes['season'] || changes['episode']) {
            this.updateUrl();
        }
    }

    private updateUrl(): void {
        if (!this.tmdbId) return;

        let url = '';
        if (this.type === 'movie') {
            url = `https://vidsrc.to/embed/movie/${this.tmdbId}`;
        } else {
            const s = this.season || 1;
            const e = this.episode || 1;
            url = `https://vidsrc.to/embed/tv/${this.tmdbId}/${s}/${e}`;
        }

        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
