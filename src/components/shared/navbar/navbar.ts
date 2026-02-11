import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../app/services/movieService';
import { Result } from '../../../app/interfaces/interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  template: `<nav class="fixed w-full z-50 top-0 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
    <div class="max-w-screen-2xl mx-auto px-6 py-3.5">
      <div class="flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/home" class="flex items-center space-x-3 group">
          <div class="relative">
            <svg class="w-10 h-10 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.7)] transition-all" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
          </div>
          <span class="text-3xl font-black tracking-tighter bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:from-yellow-300 group-hover:via-red-400 group-hover:to-pink-400 transition-all duration-300">
            movieApp
          </span>
        </a>

        <!-- Navigation Links -->
        <ul class="hidden md:flex items-center space-x-1">
          <li>
            <a routerLink="/home" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5" 
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              HOME
            </a>
          </li>
          <li>
            <a routerLink="/funciones" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              FUNCIONES
            </a>
          </li>
          <li>
            <a routerLink="/cartelera" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              CARTELERA
            </a>
          </li>
          <li>
            <a routerLink="/estrenos" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              ESTRENOS
            </a>
          </li>
          <li>
            <a routerLink="/series" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              SERIES
            </a>
          </li>
          <li>
            <a routerLink="/favoritos" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
               class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
              FAVORITOS
            </a>
          </li>
        </ul>

        <!-- Search Bar with Live Results -->
        <div class="flex items-center space-x-4">
          <div class="relative hidden md:block">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearchInput()"
              (keyup.enter)="search()"
              (focus)="showResults = true"
              (blur)="hideResultsDelayed()"
              placeholder="Buscar películas, series..."
              class="w-72 bg-white/5 border-2 border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pl-11 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all backdrop-blur-sm shadow-lg">
            <svg class="w-5 h-5 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

      <!-- Search Overlay Backdrop -->
      @if (showResults && searchQuery.trim().length > 0) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" (mousedown)="showResults = false"></div>
      }

      <!-- Horizontal Search Results Tray (Bottom) -->
      @if (showResults && searchResults.length > 0) {
        <div class="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-8 px-6 animate-slide-up">
          <div class="max-w-screen-2xl mx-auto">
            <div class="flex items-center justify-between mb-4 px-2">
              <h3 class="text-white font-bold text-lg flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                Resultados para "{{ searchQuery }}"
              </h3>
              <button (click)="search()" class="text-yellow-400 hover:text-yellow-300 text-sm font-bold transition-colors">
                Ver todos los resultados →
              </button>
            </div>

            <!-- Horizontal Scroll Container -->
            <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              @for (result of searchResults; track result.id) {
                <div (mousedown)="navigateToResult(result)" 
                     class="flex-shrink-0 w-40 snap-start group/item cursor-pointer">
                  <div class="relative aspect-[2/3] rounded-lg overflow-hidden border border-gray-800 group-hover/item:border-yellow-400/50 shadow-xl transition-all duration-300 transform group-hover/item:-translate-y-2">
                    @if (result.poster_path) {
                      <img [src]="'https://image.tmdb.org/t/p/w342' + result.poster_path" 
                           [alt]="result.title || result.name"
                           class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                      </div>
                    }
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div class="absolute bottom-2 left-2 right-2">
                      <p class="text-white text-xs font-bold truncate">{{ result.title || result.name }}</p>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-[10px] text-gray-400">{{ result.media_type === 'movie' ? 'Película' : 'Serie' }}</span>
                        <span class="flex items-center gap-0.5 text-yellow-400 text-[10px] font-bold">
                          ★ {{ result.vote_average | number:'1.1-1' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- No Results Message -->
      @if (showResults && searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching) {
        <div class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 px-6 py-3 rounded-full shadow-2xl text-gray-300 text-sm">
          No se encontraron resultados para "{{ searchQuery }}"
        </div>
      }
    </div>
  </nav>`,

          < !--Mobile Menu Button-- >
<button 
            data - collapse - toggle="navbar-sticky" 
            type = "button" 
            class= "md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none transition-colors" >
  <svg class="w-6 h-6" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24" stroke - width="2.5" >
<path stroke - linecap="round" stroke - linejoin="round" d = "M4 6h16M4 12h16M4 18h16" > </path>
</svg>
</button>
</div>
</div>

< !--Mobile Menu-- >
<div class="hidden md:hidden mt-4 pb-2" id = "navbar-sticky" >
<ul class="flex flex-col space-y-1" >
<li>
<a routerLink="/home" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  HOME
  </a>
  </li>
  < li >
  <a routerLink="/funciones" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  FUNCIONES
  </a>
  </li>
  < li >
  <a routerLink="/cartelera" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  CARTELERA
  </a>
  </li>
  < li >
  <a routerLink="/estrenos" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  ESTRENOS
  </a>
  </li>
  < li >
  <a routerLink="/series" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  SERIES
  </a>
  </li>
  < li >
  <a routerLink="/favoritos" routerLinkActive = "text-white bg-white/15 font-bold"
               class= "block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold" >
  FAVORITOS
  </a>
  </li>
  < li >
  <div class="px-4 py-2 mt-2" >
<input 
                type="text"
[(ngModel)] = "searchQuery"
  (input) = "onSearchInput()"
    (keyup.enter) = "search()"
                placeholder = "Buscar..."
                class= "w-full bg-white/5 border-2 border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:bg-white/10" >
  </div>
  </li>
  </ul>
  </div>
  </div>
  </nav>`,
  styles: `
      :host {
        display: block;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-up {
        animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  searchQuery: string = '';
  searchResults: Result[] = [];
  showResults: boolean = false;
  isSearching: boolean = false;
  searchTimeout: any;

  router = inject(Router);
  movieService = inject(MovieService);

  constructor() {
    console.log('Navbar initialized');
  }

  onSearchInput() {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // If query is empty, clear results
    if (this.searchQuery.trim().length === 0) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    // Show results and set searching state
    this.showResults = true;
    this.isSearching = true;

    // Debounce search by 150ms for faster response
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 150);
  }

  performSearch() {
    if (this.searchQuery.trim().length > 0) {
      this.movieService.searchMovies(this.searchQuery, 1).subscribe({
        next: (response) => {
          this.searchResults = response.results.slice(0, 20); // Show up to 20 results for horizontal scrolling
          this.isSearching = false;
        },
        error: (err) => {
          console.log('Search error', err);
          this.isSearching = false;
        }
      });
    }
  }

  search() {
    if (this.searchQuery.trim().length > 0) {
      this.router.navigate(['/search', this.searchQuery]);
      this.searchQuery = '';
      this.searchResults = [];
      this.showResults = false;
    }
  }

  navigateToResult(result: Result) {
    const type = result.media_type === 'movie' ? 'movie' : 'series';
    this.router.navigate([`/${type}`, result.id]);
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
  }

  hideResultsDelayed() {
    // Delay hiding to allow click events on results
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
}