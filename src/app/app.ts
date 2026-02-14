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
    private scroller = inject(ViewportScroller);

    constructor() {
        this.router.events.pipe(
            filter(e => e instanceof Scroll)
        ).subscribe((e: Scroll) => {
            if (e.routerEvent instanceof NavigationEnd) {
                const url = e.routerEvent.urlAfterRedirects;
                const isDetailPage = url.startsWith('/movie/') ||
                    url.startsWith('/series/') ||
                    url.startsWith('/actor/') ||
                    url.startsWith('/director/') ||
                    url.startsWith('/search/') ||
                    url.startsWith('/favoritos');

                if (isDetailPage) {
                    // Detail pages: Always Start at Top
                    window.scrollTo(0, 0);
                } else {
                    // List pages: Logic for Restoration vs Top
                    if (e.position) {
                        // BACK NAVIGATION: Try to restore position
                        const [x, y] = e.position;
                        let attempts = 0;
                        const checkHeightAndScroll = () => {
                            if (document.documentElement.scrollHeight >= y || attempts > 50) {
                                this.scroller.scrollToPosition(e.position!);
                            } else {
                                attempts++;
                                setTimeout(checkHeightAndScroll, 20);
                            }
                        };
                        checkHeightAndScroll();
                    } else {
                        // Forward navigation to list: Start at Top
                        window.scrollTo(0, 0);
                    }
                }
            }
        });
    }

    ngOnInit(): void {
        initFlowbite();
    }
}