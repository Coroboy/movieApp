import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';
import { SeoService } from '../../app/services/seo.service';

@Component({
    selector: 'app-actor-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, MovieCard],
    templateUrl: './actor-detail.html'
})
export class ActorDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    public movieService = inject(MovieService);
    private seoService = inject(SeoService);

    actor: any = null;
    credits: any[] = [];
    isLoading = true;
    showFullBiography = false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                window.scrollTo(0, 0);
                this.loadActorData(id);
            }
        });
    }

    loadActorData(id: string) {
        this.isLoading = true;
        this.movieService.getActorDetails(id).subscribe({
            next: (data: any) => {
                this.actor = data;
                this.seoService.updatePersonTags(this.actor);
                this.loadCredits(id);
            },
            error: () => this.isLoading = false
        });
    }

    loadCredits(id: string) {
        this.movieService.getActorCredits(id).subscribe({
            next: (data: any) => {
                // Sort by popularity and filter results with posters
                this.credits = this.movieService.filterResults(data.cast)
                    .sort((a: any, b: any) => b.popularity - a.popularity);
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    goBack() {
        window.history.back();
    }
}
