import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
    selector: 'app-search',
    imports: [MovieCard],
    template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-white mb-6">Resultados para: <span class="text-brand">{{ query }}</span></h2>
      
      @if (results.length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (item of results; track item.id) {
            <app-movie-card [movie]="item" [type]="item.media_type === 'tv' ? 'tv' : 'movie'"></app-movie-card>
          }
        </div>
        
        <div class="flex justify-center mt-8 mb-8">
            <button (click)="cargarMas()" class="bg-brand hover:bg-brand-strong text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                Cargar más resultados
            </button>
        </div>
      } @else {
        <div class="text-center py-20">
          <p class="text-2xl text-gray-400">No se encontraron resultados.</p>
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
    query: string = ''
    results: Result[] = []
    page = 1

    constructor() {
        this.activeRoute.params.subscribe(params => {
            this.query = params['query'];
            this.page = 1;
            this.results = [];
            this.buscar();
        });
    }

    buscar() {
        if (this.query) {
            this.movieS.searchMovies(this.query, this.page).subscribe({
                next: (res) => {
                    this.results = [...this.results, ...res.results]
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
