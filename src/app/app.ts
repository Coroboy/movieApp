import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Scroll } from '@angular/router';
import { filter, delay } from 'rxjs';
import { ViewportScroller } from '@angular/common';
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
    const scroller = inject(ViewportScroller);
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.routerEvent instanceof NavigationEnd) {
        const url = e.routerEvent.urlAfterRedirects;
        const isDetailPage = url.startsWith('/movie/') ||
          url.startsWith('/series/') ||
          url.startsWith('/actor/') ||
          url.startsWith('/director/') ||
          url.startsWith('/search/') ||
          url.startsWith('/favoritos');

        if (isDetailPage) {
          // For detail pages and search/favorites, ALWAYS go to top
          scroller.scrollToPosition([0, 0]);
        } else {
          // For list pages (like the home/genre carousel pages)
          if (e.position) {
            // Backward navigation: restore position
            // Small delay to ensure content is rendered and height is available
            setTimeout(() => scroller.scrollToPosition(e.position!), 0);
          } else {
            // Forward navigation: go to top
            scroller.scrollToPosition([0, 0]);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }
}