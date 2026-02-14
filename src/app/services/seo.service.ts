import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MovieDetail } from '../interfaces/interface';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private titleService = inject(Title);
    private meta = inject(Meta);

    updateTags(item: MovieDetail) {
        if (!item) return;

        const isMovie = !item.number_of_seasons; // Simple check, or pass type argument
        const type = isMovie ? 'video.movie' : 'video.tv_show';

        // Determine title and dates
        const titleText = item.title || item.name || '';
        const date = item.release_date || item.first_air_date;
        const year = date ? new Date(date).getFullYear() : '';

        const pageTitle = `${titleText} ${year ? '(' + year + ')' : ''} - movieApp`;

        const description = item.overview
            ? item.overview.substring(0, 200) + (item.overview.length > 200 ? '...' : '')
            : `Disfruta de ${titleText} en movieApp. Encuentra información de reparto, trailers y mucho más.`;

        // Use w1280 for better social compatibility
        const image = item.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
            : (item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : '');

        this.applyTags(pageTitle, description, image, type);
    }

    updatePersonTags(person: any) {
        if (!person) return;

        const pageTitle = `${person.name} - movieApp`;
        const description = person.biography
            ? person.biography.substring(0, 200) + (person.biography.length > 200 ? '...' : '')
            : `Conoce más sobre ${person.name} en movieApp. Biografía, filmografía y más.`;

        const image = person.profile_path
            ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
            : '';

        this.applyTags(pageTitle, description, image, 'profile');
    }

    private applyTags(title: string, description: string, image: string, type: string) {
        const url = typeof window !== 'undefined' ? window.location.href : '';

        // Update Browser Title
        this.titleService.setTitle(title);

        // Standard Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'author', content: 'movieApp' });

        // Open Graph Tags
        this.meta.updateTag({ property: 'og:site_name', content: 'movieApp' });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: type });

        // Twitter Tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
    }
}
