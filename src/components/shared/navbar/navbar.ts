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

        <!-- Search Bar -->
        <div class="flex items-center space-x-4">
          <div class="relative hidden md:block">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="search()"
              placeholder="Buscar películas, series..."
              class="w-72 bg-white/5 border-2 border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pl-11 text-sm font-medium focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all backdrop-blur-sm shadow-lg">
            <svg class="w-5 h-5 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
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
  mobileMenuOpen: boolean = false;

  router = inject(Router);

  constructor() {
    console.log('Navbar initialized');
  }

  search() {
    if (this.searchQuery.trim().length > 0) {
      this.router.navigate(['/search', this.searchQuery]);
      this.searchQuery = '';
      this.mobileMenuOpen = false;
    }
  }
}