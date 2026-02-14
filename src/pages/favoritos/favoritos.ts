
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { FavoritesService } from '../../app/services/favorites.service';

@Component({
  selector: 'app-favoritos',
  imports: [MovieCard],
  template: `
    <div class="w-full px-4 md:px-12 py-8 pt-20">
      
      @if (favorites.length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          @for (item of favorites; track item.id) {
            <app-movie-card [movie]="item" [type]="item.media_type === 'tv' ? 'tv' : 'movie'"></app-movie-card>
          }
        </div>
      } @else {
        <div class="text-center py-20">
          <p class="text-2xl text-gray-400">Aún no tienes favoritos.</p>
          <p class="text-lg text-gray-500 mt-2">Agrega películas o series a tu lista para verlas aquí.</p>
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
export class Favoritos implements OnInit {
  favoritesService = inject(FavoritesService);
  favorites: Result[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }
}
