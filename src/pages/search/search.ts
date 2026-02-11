import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  imports: [MovieCard],
  template: `
    <div class="container mx-auto px-4 py-8 min-h-screen">
      <h2 class="text-3xl font-bold text-slate-800 mb-6 transition-colors">Resultados para: <span class="text-slate-600 italic">"{{ query }}"</span></h2>
      
      @if (results.length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          @for (item of results; track item.id) {
            <app-movie-card [movie]="item" [type]="item.media_type === 'tv' ? 'tv' : 'movie'"></app-movie-card>
          }
        </div>
        
        <div class="flex justify-center mt-12 mb-8">
            <button (click)="cargarMas()" class="bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 px-10 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95">
                Ver más resultados
            </button>
        </div>
      } @else {
        <div class="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
          <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-2xl text-gray-400 font-medium">No se encontraron resultados para su búsqueda.</p>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Search {
  activeRoute = inject(ActivatedRoute)
  movieS = inject(MovieService)
  meta = inject(Meta)
  titleService = inject(Title)
  query: string = ''
  results: Result[] = []
  page = 1

  updateMetaTags() {
    const title = `Resultados para "${this.query}" - movieApp`;
    const description = `Explora los resultados de búsqueda para "${this.query}" en movieApp. Encuentra películas y series.`;
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  constructor() {
    this.activeRoute.params.subscribe(params => {
      this.query = params['query'];
      this.page = 1;
      this.results = [];
      this.updateMetaTags();
      this.buscar();
    });
  }

  buscar() {
    if (this.query) {
      this.movieS.searchMovies(this.query, this.page).subscribe({
        next: (res) => {
          const filteredResults = this.movieS.filterResults(res.results);
          this.results = [...this.results, ...filteredResults]
        },
        error: (err) => console.log(err)
      })
    }
  }

  cargarMas() {
    this.page++
    this.buscar()
  }
}
