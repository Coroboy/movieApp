import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../app/services/movieService';
import { Result } from '../../../app/interfaces/interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  template: `<nav class="fixed w-full z-[100] top-0 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
    <div class="relative z-[60] max-w-screen-2xl mx-auto px-6 py-3.5">
      <div class="flex items-center justify-between">
        
        <!-- Logo -->
        <a href="https://flowbite.com" class="flex items-center space-x-3 group">
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

        <!-- Search Bar -->
        <div class="flex items-center space-x-4">
          <div class="relative hidden md:block group">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearchInput()"
              (focus)="showDropdown = true"
              (blur)="hideDropdownDelayed()"
              (keyup.enter)="search()"
              placeholder="Buscar películas, series..."
              class="w-72 bg-white/5 border-2 border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pl-11 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all backdrop-blur-sm shadow-lg">
            <svg class="w-5 h-5 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

            <!-- Vertical Search Dropdown -->
            @if (showDropdown && searchResults.length > 0 && searchQuery.length > 0) {
              <div class="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent z-[70]">
                @for (result of searchResults; track result.id) {
                  <div (click)="navigateToResult(result)" class="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-0 group/item">
                    <!-- Thumbnail -->
                    <div class="flex-shrink-0 w-12 h-16 rounded-md overflow-hidden bg-gray-800 shadow-md">
                      @if (result.poster_path) {
                        <img [src]="'https://image.tmdb.org/t/p/w92' + result.poster_path" 
                             class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                      }
                    </div>
                    
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <h4 class="text-white text-sm font-bold truncate group-hover/item:text-yellow-400 transition-colors">{{ result.title || result.name }}</h4>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-semibold">{{ result.media_type === 'movie' ? 'PELÍCULA' : 'SERIE' }}</span>
                        <span class="text-xs text-gray-400">{{ (result.release_date || result.first_air_date) | date:'yyyy' }}</span>
                        <span class="text-xs text-yellow-500 font-bold flex items-center gap-0.5">
                          ★ {{ result.vote_average | number:'1.1-1' }}
                        </span>
                      </div>
                    </div>
                  </div>
                }
                
                <div class="p-2 bg-white/5 text-center">
                  <button (click)="search()" class="text-xs text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-wide py-1">
                    Ver todos los resultados
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Mobile Menu Button -->
          <button 
            (click)="mobileMenuOpen = !mobileMenuOpen"
            type="button" 
            class="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div [class.hidden]="!mobileMenuOpen" class="md:hidden mt-4 pb-2">
        <ul class="flex flex-col space-y-1">
          <li><a routerLink="/home" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">HOME</a></li>
          <li><a routerLink="/funciones" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">FUNCIONES</a></li>
          <li><a routerLink="/cartelera" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">CARTELERA</a></li>
          <li><a routerLink="/estrenos" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">ESTRENOS</a></li>
          <li><a routerLink="/series" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">SERIES</a></li>
          <li><a routerLink="/favoritos" (click)="mobileMenuOpen = false" class="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold">FAVORITOS</a></li>
          <li>
            <div class="px-4 py-2 mt-2">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (keyup.enter)="search()"
                placeholder="Buscar..."
                class="w-full bg-white/5 border-2 border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:bg-white/10">
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
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  searchQuery: string = '';
  searchResults: Result[] = [];
  showDropdown: boolean = false;
  mobileMenuOpen: boolean = false;
  searchTimeout: any;

  router = inject(Router);
  movieService = inject(MovieService);

  constructor() {
    console.log('Navbar initialized');
  }

  onSearchInput() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    if (this.searchQuery.trim().length === 0) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }

    this.showDropdown = true;
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  performSearch() {
    if (this.searchQuery.trim().length > 0) {
      this.movieService.searchMovies(this.searchQuery, 1).subscribe({
        next: (response) => {
          this.searchResults = response.results.slice(0, 5); // Limit to 5 results for vertical dropdown
        },
        error: (err) => console.log(err)
      });
    }
  }

  search() {
    if (this.searchQuery.trim().length > 0) {
      this.router.navigate(['/search', this.searchQuery]);
      this.mobileMenuOpen = false;
      this.hideDropdown();
    }
  }

  navigateToResult(result: Result) {
    const type = result.media_type === 'movie' ? 'movie' : 'series';
    this.router.navigate([`/${type}`, result.id]);
    this.searchQuery = '';
    this.searchResults = [];
    this.showDropdown = false;
    this.mobileMenuOpen = false;
  }

  hideDropdownDelayed() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  hideDropdown() {
    this.showDropdown = false;
    this.searchResults = [];
  }
}