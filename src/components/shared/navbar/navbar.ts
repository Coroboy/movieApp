import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../app/services/movieService';
import { Result } from '../../../app/interfaces/interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  template: `<nav class="fixed w-full top-0 bg-transparent transition-all duration-500 ease-out z-[100]"
    [style.z-index]="(mobileSearchActive || mobileMenuOpen) ? 9999 : 100">
    <!-- Background Dimming Overlay -->
    <div (click)="closeAll()" 
         class="fixed inset-0 bg-black/60 z-[1000] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) pointer-events-none opacity-0"
         [class.opacity-100]="mobileSearchActive || mobileMenuOpen"
         [class.!pointer-events-auto]="mobileSearchActive || mobileMenuOpen"></div>

    <div class="relative z-[1010] w-full px-6 md:px-12 py-3.5">
      <div class="flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/peliculas" (click)="closeAll()" class="flex items-center space-x-3 group cursor-pointer">
          <div class="relative">
            <svg class="w-10 h-10 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.7)] transition-all" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
          </div>
          <span class="text-3xl font-black tracking-tighter text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300">
            movieApp
          </span>
        </a>

        <!-- Desktop Navigation Links - ABSOLUTELY CENTERED RELATIVE TO SCREEN -->
        <div class="hidden md:flex absolute inset-x-0 bottom-3.5 items-center justify-center pointer-events-none">
          <ul class="flex items-center space-x-1 pointer-events-auto">
            <li>
              <a routerLink="/peliculas" routerLinkActive="text-white font-bold bg-white/10 shadow-lg shadow-white/5"
                 class="px-5 py-2.5 text-gray-200 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 tracking-wide">
                PELÍCULAS
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
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-2">
          
          <!-- Unified Search Toggle (Desktop & Mobile) -->
          <button 
            (click)="toggleMobileSearch()"
            type="button" 
            class="p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            type="button" 
            class="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Unified Search Input Box (Drops down for both desktop and mobile) -->
      <div (click)="$event.stopPropagation()"
           class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[95%] md:w-full md:max-w-7xl bg-gray-900/98 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[35px] md:rounded-[45px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[1010]"
           [class.opacity-100]="mobileSearchActive"
           [class.translate-y-0]="mobileSearchActive"
           [class.scale-100]="mobileSearchActive"
           [class.pointer-events-auto]="mobileSearchActive"
           [class.opacity-0]="!mobileSearchActive"
           [class.translate-y-[-10px]]="!mobileSearchActive"
           [class.scale-95]="!mobileSearchActive"
           [class.pointer-events-none]="!mobileSearchActive">
        <div class="w-full relative px-2">
          <input 
            type="text" 
            id="mobileSearchInput"
            [(ngModel)]="searchQuery" 
            (input)="onSearchInput()"
            (keyup.enter)="search()"
            placeholder="¿Qué quieres ver hoy?"
            class="w-full bg-white/5 border-2 border-yellow-400/20 text-white placeholder-gray-500 rounded-2xl px-6 py-4 md:py-5 pl-20 md:pl-24 text-lg md:text-2xl font-black focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all shadow-inner">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-yellow-400 absolute left-8 md:left-10 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <!-- Clear Search Button -->
          @if (searchQuery.length > 0) {
            <button (click)="clearSearch()" class="absolute right-8 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }
        </div>

        <!-- Quick Results -->
        @if (searchResults.length > 0 && searchQuery.length > 0) {
          <div class="mt-4 space-y-1 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide animate-fade-in-up">
            @for (result of searchResults; track result.id) {
              <div (click)="navigateToResult(result)" class="py-2.5 px-1 hover:bg-white/5 rounded-lg transition-all cursor-pointer group">
                <h4 class="text-white text-sm md:text-base font-medium truncate group-hover:text-yellow-400 transition-colors">
                  {{ result.title || result.name }}
                </h4>
              </div>
            }
          </div>
        }
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden absolute top-[calc(100%+8px)] left-4 right-4 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[1010]"
           [class.opacity-100]="mobileMenuOpen"
           [class.translate-y-0]="mobileMenuOpen"
           [class.scale-100]="mobileMenuOpen"
           [class.pointer-events-auto]="mobileMenuOpen"
           [class.opacity-0]="!mobileMenuOpen"
           [class.translate-y-[-10px]]="!mobileMenuOpen"
           [class.scale-95]="!mobileMenuOpen"
           [class.pointer-events-none]="!mobileMenuOpen">
        <ul class="flex flex-col p-4 space-y-1">
          <li>
            <a routerLink="/peliculas" (click)="closeAll()" 
               routerLinkActive="text-yellow-400 bg-white/5"
               class="block px-6 py-4 text-gray-200 hover:text-white rounded-2xl transition-all font-bold tracking-wide">
               PELÍCULAS
            </a>
          </li>
          <li>
            <a routerLink="/series" (click)="closeAll()" 
               routerLinkActive="text-yellow-400 bg-white/5"
               class="block px-6 py-4 text-gray-200 hover:text-white rounded-2xl transition-all font-bold tracking-wide">
               SERIES
            </a>
          </li>
          <li>
            <a routerLink="/favoritos" (click)="closeAll()" 
               routerLinkActive="text-yellow-400 bg-white/5"
               class="block px-6 py-4 text-gray-200 hover:text-white rounded-2xl transition-all font-bold tracking-wide">
               FAVORITOS
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`,
  styles: `
      :host {
        display: block;
      }
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in-down {
        animation: fadeInDown 0.3s ease-out forwards;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  searchQuery: string = '';
  searchResults: Result[] = [];
  showDropdown: boolean = false;
  mobileMenuOpen: boolean = false;
  mobileSearchActive: boolean = false;
  searchTimeout: any;

  router = inject(Router);
  movieService = inject(MovieService);

  constructor() {
    effect(() => {
      const isOpen = this.movieService.isMenuOpen();
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  toggleMobileSearch() {
    this.mobileSearchActive = !this.mobileSearchActive;
    if (this.mobileSearchActive) {
      this.mobileMenuOpen = false;
      // Focus input after transition starts
      setTimeout(() => {
        const input = document.getElementById('mobileSearchInput');
        if (input) (input as HTMLInputElement).focus();
      }, 100);
    }
    this.movieService.isMenuOpen.set(this.mobileSearchActive || this.mobileMenuOpen);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) this.mobileSearchActive = false;
    this.movieService.isMenuOpen.set(this.mobileMenuOpen || this.mobileSearchActive);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showDropdown = false;
    const input = document.getElementById('mobileSearchInput');
    if (input) (input as HTMLInputElement).focus();
  }

  closeAll() {
    this.mobileMenuOpen = false;
    this.mobileSearchActive = false;
    this.showDropdown = false;
    this.movieService.isMenuOpen.set(false);
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
          // Sort results by popularity and rating
          const sortedResults = response.results.sort((a, b) => {
            const scoreA = (a.popularity || 0) + (a.vote_average || 0) * 10;
            const scoreB = (b.popularity || 0) + (b.vote_average || 0) * 10;
            return scoreB - scoreA;
          });
          this.searchResults = sortedResults.slice(0, 10);
        },
        error: (err) => console.log(err)
      });
    }
  }

  search() {
    if (this.searchQuery.trim().length > 0) {
      this.router.navigate(['/search', this.searchQuery]);
      this.closeAll();
    }
  }

  navigateToResult(result: Result) {
    const type = result.media_type === 'movie' ? 'movie' : 'series';
    this.router.navigate([`/${type}`, result.id]);
    this.searchQuery = '';
    this.searchResults = [];
    this.closeAll();
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