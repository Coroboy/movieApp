import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
    selector: 'app-director-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, MovieCard],
    templateUrl: './director-detail.html'
})
export class DirectorDetail implements OnInit {
    private route = inject(ActivatedRoute);
    public movieService = inject(MovieService);

    director: any = null;
    credits: any[] = [];
    isLoading = true;
    showFullBiography = false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                window.scrollTo(0, 0);
                this.loadDirectorData(id);
            }
        });
    }

    loadDirectorData(id: string) {
        this.isLoading = true;
        this.movieService.getActorDetails(id).subscribe({
            next: (data) => {
                this.director = data;
                this.loadCredits(id);
            },
            error: () => this.isLoading = false
        });
    }

    loadCredits(id: string) {
        this.movieS.getActorCredits(id).subscribe({
            next: (data) => {
                // For directors, we search in 'crew' and filter by job 'Director'
                const directingCredits = data.crew.filter((item: any) => item.job === 'Director');

                // Sort by popularity and filter results with posters
                this.credits = this.movieService.filterResults(directingCredits)
                    .sort((a: any, b: any) => b.popularity - a.popularity);
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    private get movieS() {
        return this.movieService;
    }

    goBack() {
        window.history.back();
    }
}
