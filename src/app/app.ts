import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { Navbar } from '../components/shared/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('movieApp');
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Force scroll to top ONLY for detail pages
      const isDetailPage = url.startsWith('/movie/') ||
        url.startsWith('/series/') ||
        url.startsWith('/actor/') ||
        url.startsWith('/director/');

      if (isDetailPage) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }
}